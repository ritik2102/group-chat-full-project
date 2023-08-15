const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 

const Archived = sequelize.define('archivedmessage', {
  messageID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
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

module.exports = Archived;