const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 

const Message = sequelize.define('message', {
  messageID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId:Sequelize.INTEGER,
  groupId:Sequelize.INTEGER,
  userName:Sequelize.STRING,
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  type:Sequelize.STRING,
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = Message;