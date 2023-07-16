const Message=require('../model/message');

exports.postMessage=(req,res,next)=>{
    console.log('controller');
    // console.log(req.user.dataValues);
    // console.log(req.user.id);
    const message=req.body.message;
    console.log(message);
    Message.create({userId:req.user.id,userName:req.user.name,content:message,timestamp: new Date()})
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
    Message.findAll()
        .then(messages=>{
            res.status(201).json({"response":messages});
        })
        .catch(err=>{
            throw new Error(err);
        })
}