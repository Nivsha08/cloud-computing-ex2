const dotenv = require('dotenv');
const express = require('express');
const db = require('./db.js');
const userRoutes = require('./routes/users.js');
const groupRoutes = require('./routes/groups.js');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (_, res) => {
  res.status(202).send('Healthy!');
});

app.use(userRoutes);
app.use(groupRoutes);

db.connect().then(() => {
  app.listen(3000, () => {
    console.log('--- Server started ---');
  });
});

module.exports.handler = app;
