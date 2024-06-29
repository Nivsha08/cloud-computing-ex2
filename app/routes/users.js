const router = require('express').Router();
const { UsersManager } = require('../managers/users');
const { MessagesManager } = require('../managers/messages');
const { success, failure } = require('./utils');

router.post('/users', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send(failure('Invalid parameters: expected {name}.', req));
  }

  try {
    const user = await UsersManager.createUser(name);
    res.status(200).send(success(user, req));
  } catch (err) {
    res.status(500).send(failure(err, req));
  }
});

router.post('/users/:userId/block', async (req, res) => {
  const { userId } = req.params;
  const { blockedUserId } = req.body;

  if (!blockedUserId) {
    return res.status(400).send(failure('Invalid parameters: expected {blockedUserId}.', req));
  }

  try {
    await UsersManager.blockUser(userId, blockedUserId);
    res.status(200).send(success({}, req));
  } catch (err) {
    res.status(500).send(failure(err, req));
  }
});

router.post('/users/:userId/unblock', async (req, res) => {
  const { userId } = req.params;
  const { blockedUserId } = req.body;

  if (!blockedUserId) {
    return res.status(400).send(failure('Invalid parameters: expected {blockedUserId}.', req));
  }

  try {
    await UsersManager.unBlockUser(userId, blockedUserId);
    res.status(200).send(success({}, req));
  } catch (err) {
    res.status(500).send(failure(err, req));
  }
});

router.get('/users/:userId/messages', async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await UsersManager.getUserMessages(userId);
    res.status(200).send(success({ messages }, req));
  } catch (err) {
    res.status(500).send(failure(err, req));
  }
});

router.post('/users/:userId/message', async (req, res) => {
  const { userId } = req.params;
  const { senderId, content } = req.body;

  try {
    const recipient = await UsersManager.getUserById(userId);

    if (recipient.blockedUsers.includes(senderId)) {
      return res.status(403).send(failure('You are blocked from sending messages to this user', req));
    }

    await MessagesManager.sendDirectMessage(recipient._id, senderId, content);
    res.status(200).send(success({}, req));
  } catch (error) {
    res.status(500).send(failure(error, req));
  }
});

module.exports = router;
