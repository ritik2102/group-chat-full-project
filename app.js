const express=require("express");

const app=express();

const bodyParser=require('body-parser');
app.use(bodyParser.json({extended:false}));

const cors=require('cors');
// app.use(cors());
app.use(
    cors({
        origin:"http://127.0.0.1:5500",
        origin:"http://127.0.0.1:5501"
    })
)
const sequelize=require('./util/database');

const userRoutes=require('./routes/users');
const messageRoutes=require('./routes/message');
const groupRoutes=require('./routes/group');

app.use('/users',userRoutes);
app.use('/message',messageRoutes);
app.use('/group',groupRoutes);

const User=require('./model/user');
const Message=require('./model/message');
const Group=require('./model/group');
const UserGroup=require('./model/usergroup');

// Relationship between user and messages
User.hasMany(Message);
Message.belongsTo(User);

// Relationship between Message and Group
Group.hasMany(Message);
Message.belongsTo(Group);

// Relationship between Users and Groups
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

// sequelize.sync({force:true})
sequelize.sync()
    .then(result=>{
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err);
    })