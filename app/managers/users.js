const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const { Message } = require('./messages');

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  createdAt: { type: Number, required: true },
  name: { type: String, required: true },
  blockedUsers: [{ type: String, ref: 'User' }],
  groups: [{ type: String, ref: 'Group' }]
});

const User = mongoose.model('User', schema, 'users');

const createUser = async (name) => {
  const user = new User({ _id: uuidv4(), createdAt: moment().unix(), name, blockedUsers: [], groups: [] });
  const result = await user.save();

  console.info('User created:', result);
  return result;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw `User with id ${userId} not found.`;
  }

  return user;
};

const blockUser = async (userId, blockedUserId) => {
  const user = await getUserById(userId);

  user.blockedUsers.push(blockedUserId);
  await user.save();

  console.info(`Added ${blockedUserId} to blocked users of ${userId}.`);
};

const unBlockUser = async (userId, blockedUserId) => {
  const user = await getUserById(userId);

  user.blockedUsers = user.blockedUsers.filter((id) => id !== blockedUserId);
  await user.save();

  console.info(`Removed ${blockedUserId} from ${userId}'s blocked users.`);
};

const getUserMessages = async (userId) => {
  const user = await getUserById(userId);
  const messages = await Message.find({
    $or: [{ recipientId: userId }, { groupId: { $in: user.groups } }]
  }).sort({ sentAt: -1 });

  const visibleMessages = messages.filter(({ senderId }) => !user.blockedUsers.includes(senderId));
  return visibleMessages;
};

module.exports = { User, UsersManager: { createUser, getUserById, blockUser, unBlockUser, getUserMessages } };
