const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 

const Group = sequelize.define('group', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name:Sequelize.STRING,
  createdBy:Sequelize.INTEGER,
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = Group;