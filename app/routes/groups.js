const router = require('express').Router();
const { GroupsManager } = require('../managers/groups');
const { MessagesManager } = require('../managers/messages');
const { UsersManager } = require('../managers/users');
const { success, failure } = require('./utils');

router.post('/groups', async (req, res) => {
  const { adminId, name } = req.body;

  if (!name) {
    return res.status(400).send(failure('Invalid parameters: expected {name}.', req));
  }

  try {
    const admin = await UsersManager.getUserById(adminId);
    const group = await GroupsManager.createGroup(adminId, name);

    admin.groups.push(group._id);

    res.status(200).send(success(group, req));
  } catch (err) {
    res.status(500).send(failure(err, req));
  }
});

router.put('/groups/:groupId/members/add', async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const user = await UsersManager.getUserById(userId);
    const group = await GroupsManager.addUserToGroup(groupId, user._id);

    user.groups.push(group._id);
    user.save();

    res.status(200).send(success(group, req));
  } catch (err) {
    res.status(500).send(failure(err, req));
  }
});

router.put('/groups/:groupId/members/remove', async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const user = await UsersManager.getUserById(userId);
    const group = await GroupsManager.removeUserFromGroup(groupId, user._id);

    user.groups = user.groups.filter((id) => id !== group._id);
    user.save();

    res.status(200).send(success(group, req));
  } catch (err) {
    res.status(500).send(failure(err, req));
  }
});

router.post('/groups/:groupId/message', async (req, res) => {
  const { groupId } = req.params;
  const { senderId, content } = req.body;

  try {
    const group = await GroupsManager.getGroupById(groupId);
    const message = await MessagesManager.sendGroupMessage(group._id, senderId, content);

    group.messsages.push(message._id);
    group.save();

    res.status(200).send(success({}, req));
  } catch (error) {
    res.status(500).send(failure(error, req));
  }
});

module.exports = router;
