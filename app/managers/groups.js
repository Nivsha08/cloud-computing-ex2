const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Number, required: true },
  admin: { type: String, ref: 'User', required: true },
  members: [{ type: String, ref: 'User' }],
  messsages: [{ type: String, ref: 'Message' }]
});

const Group = model('Group', schema, 'groups');

const createGroup = async (adminId, name) => {
  const group = new Group({
    _id: uuidv4(),
    createdAt: moment().unix(),
    name,
    admin: adminId,
    members: [adminId],
    messsages: []
  });

  const result = await group.save();

  console.info(`Group ${name} created successfully.`);
  return result;
};

const getGroupById = async (groupId) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw `Group with id ${groupId} not found.`;
  }

  return group;
};

const addUserToGroup = async (groupId, userId) => {
  const group = await getGroupById(groupId);

  group.members.push(userId);
  await group.save();
  console.info(`User ${userId} successfully added to group ${groupId}.`);

  return group;
};

const removeUserFromGroup = async (groupId, userId) => {
  const group = await getGroupById(groupId);

  group.members = group.members.filter((id) => id !== userId);
  await group.save();
  console.info(`User ${userId} successfully removed from group ${groupId}.`);

  return group;
};

module.exports = { GroupsManager: { createGroup, getGroupById, addUserToGroup, removeUserFromGroup } };
