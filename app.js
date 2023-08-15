const express = require("express");
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});


const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: false }));

const cors = require('cors');
app.use(cors());




io.on('connection', (socket) => {
  console.log('A new client connected');

  socket.on('joinGroup', (groupName) => {
    //   console.log("Group");
    //   console.log(groupName);
    socket.join(groupName); // Join the specified group
  });

  // Handle messages from clients
  socket.on('sendMessageToGroup', ({ groupName, userName, message }) => {

    // Broadcast the message to all clients in the group
    //   io.to(groupName).emit('message', message); 

    // Broadcast the message to users other than the user that sent the message
    socket.to(groupName).emit('message', { userName, message });
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});



const sequelize = require('./util/database');

const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');


app.use('/users', userRoutes);
app.use('/message', messageRoutes);
app.use('/group', groupRoutes);



const User = require('./model/user');
const Message = require('./model/message');
const Group = require('./model/group');
const UserGroup = require('./model/usergroup');
const Archived=require('./model/archived');

// Relationship between user and messages
User.hasMany(Message);
Message.belongsTo(User);

// Relationship between Message and Group
Group.hasMany(Message);
Message.belongsTo(Group);

// Relationship between Users and Groups
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

var CronJob = require('cron').CronJob;
var job = new CronJob(
    '0 0 0 * * *',
    async function() {
      const messagesToMove = await Message.findAll(); // Retrieve all messages from the Message table

      // Create a transaction to ensure data integrity
      await sequelize.transaction(async (t) => {
      // Insert each message into the Archived table
      await Archived.bulkCreate(messagesToMove, { transaction: t });
      // Delete all messages from the Message table
      await Message.destroy({ where: {}, truncate: true, transaction: t });
      });
  
    },
    null,
    true,
    'America/Los_Angeles'
);

// sequelize.sync({force:true})
sequelize.sync()
  .then((result) => {
    const port = 3000;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });