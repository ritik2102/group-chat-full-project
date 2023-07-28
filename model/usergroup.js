const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 

const UserGroup = sequelize.define('usergroup', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId:Sequelize.INTEGER,
  groupId:Sequelize.INTEGER,
  isAdmin:Sequelize.BOOLEAN
});

module.exports = UserGroup;