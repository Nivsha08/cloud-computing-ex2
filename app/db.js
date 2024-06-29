const mongoose = require('mongoose');

const DB_USERNAME = process.env.MONGODB_ADMINUSERNAME;
const DB_PASSWORD = process.env.MONGODB_ADMINPASSWORD;
const DB_SERVER = process.env.MONGODB_SERVER;

const DB_CONNECTION_STRING = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_SERVER}`;

const DB_NAME = 'messaging-service';

const connect = async () => {
  return mongoose
    .connect(DB_CONNECTION_STRING, { dbName: DB_NAME })
    .then(() => console.log('--- Database Connected Successfully ---'))
    .catch((err) => console.error('Database connection error', err));
};

module.exports = { connect };
