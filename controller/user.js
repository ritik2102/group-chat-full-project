const bcrypt=require('bcrypt');
// To compare the password
const jwt=require('jsonwebtoken');
// To create token for user to login
const User=require('../model/user');

exports.postUser = (req, res, next) => {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const mobile=req.body.mobile;
        const password = req.body.password;

        // console.log(name,email,mobile,password);
        bcrypt.hash(password, 10, (err, hash) => {
            User.create({ name: name, email: email,mobile:mobile, password: hash})
                .then(result => {
                    res.status(201).json({ resData: "success" });
                })
                .catch(err => {
                    const error = err.errors[0].message;
                    res.status(201).json({ resData:"duplicate"});
                })
        })
    }
    catch (err) {
        throw new Error(err);
    }
}

function generateAccessToken(id,name){
    try{
        return jwt.sign({userId:id,name:name},process.env.TOKEN_SECRET);
    } catch(err){
        throw new Error(err);
    }
}

exports.userLogin=(req,res,next)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;

        User.findAll({where:{email:email}})
            .then(users=>{
                // if user does not exist
                if(!users[0]){
                    res.status(404).json({resData:"notFound"});
                }
                // if user exists
                else{
                    hash=users[0].dataValues.password;
                    
                    bcrypt.compare(password,hash,(err,result)=>{
                        if(err){
                            throw new Error("Someething went wrong");
                        }
                        if(result===true){
                            res.status(201).json({"success":true,token:generateAccessToken(users[0].id,users[0].name)});
                        } else{
                            res.status(401).json({"success":false});
                        }
                    })
                }
            })

    } catch(err){
        throw new Error(err);
    }
}

exports.getUser=(req,res,next)=>{
    // console.log(req.user.name);
    res.status(201).json({"name":req.user.name});
}