const express=require("express");

const app=express();

const bodyParser=require('body-parser');
app.use(bodyParser.json({extended:false}));

const cors=require('cors');
// app.use(cors());
app.use(
    cors({
        origin:"http://127.0.0.1:5500",
    })
)
const sequelize=require('./util/database');

const userRoutes=require('./routes/users');
const messageRoutes=require('./routes/message');

app.use('/users',userRoutes);
app.use('/message',messageRoutes);

const User=require('./model/user');
const Message=require('./model/message');

User.hasMany(Message);
Message.belongsTo(User);
// {force:true}
sequelize.sync()
    .then(result=>{
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err);
    })