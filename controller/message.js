const Message=require('../model/message');
const Sequelize=require("sequelize");

exports.postMessage=(req,res,next)=>{
    const groupId=req.header("groupId");
    const userId=req.user.id;
    // console.log(req.user.dataValues);
    // console.log(req.user.id);
    const message=req.body.message;
    console.log(message,userId,groupId);
    // console.log(message);
    Message.create({userId:userId,groupId:groupId,userName:req.user.name,content:message,timestamp: new Date()})
        .then(response=>{
            // console.log(response.dataValues);
            res.status(201).json({"response":response.dataValues});
        })
        .catch(err=>{
            throw new Error(err);
        })
}


exports.getMessage=(req,res,next)=>{
    // console.log(req.user);
    const lastMessageId=+req.query.lastMessageId;
    const groupId=+req.header("groupId");
    if(lastMessageId){
        Message.findAll(
            {where:
                 {messageID: {[Sequelize.Op.gt]: lastMessageId},
                 groupId:groupId}
            })
            .then(messages=>{
                res.status(201).json({"response":messages});
            })
            .catch(err=>{
                throw new Error(err);
            })
    } else{
        Message.findAll(
            {where:{groupId:groupId}})
            .then(messages=>{
                res.status(201).json({"response":messages});
            })
            .catch(err=>{
                throw new Error(err);
            })
    }
    
}