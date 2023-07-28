const jwt=require('jsonwebtoken');
const User=require('../model/user');

require('dotenv').config();

const authenticate=(req,res,next)=>{
    try{
        const token=req.header('Authorization');
        const user=jwt.verify(token,process.env.TOKEN_SECRET);
        
        User.findByPk(user.userId).
            then(user=>{
                req.user=user;
                // console.log(req.user);
                next();
            })
            .catch(err=>{
                throw new Error(err);
            })
    } catch(err){
        throw new Error(err);
    }
}

module.exports={authenticate};