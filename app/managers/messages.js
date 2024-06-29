const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const schema = new Schema({
  _id: { type: String, required: true },
  senderId: { type: String, ref: 'User', required: true },
  recipientId: { type: String, ref: 'User' },
  groupId: { type: String, ref: 'Group' },
  sentAt: { type: Number, required: true },
  content: { type: String, required: true }
});

schema.index({ recipientId: 1 });
schema.index({ groupId: 1 });

const Message = model('Message', schema, 'messages');

const sendDirectMessage = async (recipientId, senderId, content) => {
  const message = new Message({ _id: uuidv4(), sentAt: moment().unix(), senderId, recipientId, content });
  await message.save();

  console.info(`Message sent successfully from user ${senderId} to user ${recipientId}`);
};

const sendGroupMessage = async (groupId, senderId, content) => {
  const message = new Message({ _id: uuidv4(), sentAt: moment().unix(), senderId, groupId, content });
  await message.save();

  console.info(`Message sent successfully from user ${senderId} to group ${groupId}`);
  return message;
};

module.exports = { Message, MessagesManager: { sendDirectMessage, sendGroupMessage } };
