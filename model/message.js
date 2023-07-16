const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 

const Message = sequelize.define('Message', {
  messageID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId:Sequelize.INTEGER,
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = Message;