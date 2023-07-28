const Group = require('../model/group');
const UserGroup = require('../model/usergroup');
const sequelize = require('../util/database');

exports.addGroup = async (req, res, next) => {
    try {
        const t = await sequelize.transaction();
        const name = req.body.name;
        const userId = req.user.id;
        console.log(name);
        
        Group.create({ name: name, createdBy: req.user.id, createdAt: new Date() }, { transaction: t })
            .then(response => {
                const groupId = response.dataValues.id;

                UserGroup.create({ userId: userId, groupId: groupId ,isAdmin:true }, { transaction: t })
                    .then(async () => {
                        await t.commit();
                        res.status(201).json({ "success": true });
                    })

            })
            .catch(err => {
                console.log(err);
            })
        // console.log(req);
    } catch (err) {
        throw new Error(err);
    }
}

exports.getGroups=async (req,res,next)=>{
    try{
        const userId=req.user.id;
        console.log(userId);
        await UserGroup.findAll({where:{userId:userId}})
            .then(async(response)=>{
                // console.log(response.dataValues);
                let groups=[];
                for(let i=0;i<response.length;i++){
                    const groupId=response[i].dataValues.groupId;
                    await Group.findAll({where:{id:groupId}})
                        .then(groupInfo=>{
                            // console.log(groupInfo[0].dataValues);
                            groups.push(groupInfo[0].dataValues)
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                }
                res.status(201).json({"response":groups});
            })
            .catch(err=>{
                console.log(err);
            })
    } catch(err){
        console.log(err);
    }
}

exports.addMember=async(req,res,next)=>{
    try{
        const userId=req.body.user;
        const groupId=req.body.group;
        console.log(userId,groupId);

        UserGroup.create({userId:userId ,groupId:groupId ,isAdmin:false})
            .then(response=>{
                res.status(201).json({"success":true});
            })
            .catch(err=>{
                console.log(err);
            })
           
    } catch (err){
        throw new Error(err);
    }
}

exports.removeMember=async(req,res,next)=>{
    try{
        const userId=req.body.userId;
        const groupId=req.body.groupId;
        // console.log(userId,groupId);
        UserGroup.findAll({where:{userId:userId,groupId:groupId}})
            .then(usergroup=>{
                usergroup[0].destroy();
                res.status(201).json({"success":true});
            })
            .catch(err=>{
                throw new Error(err);
            })
    } catch(err){
        throw new Error(err);
    }
}

exports.isAdmin=(req,res,next)=>{
    try{
        const userId=req.user.id;
        const groupId=req.header("groupId");
        
        UserGroup.findAll({where:{groupId:groupId,userId:userId}})
            .then(response=>{
                // console.log(response[0].dataValues);
                const dataValues=response[0].dataValues;
                if(dataValues.isAdmin){
                    res.status(201).json({"isAdmin":true});
                } else{
                    res.status(201).json({"isAdmin":false});
                }   
            })
            .catch(err=>{
                throw new Error(err);
            })
    } catch(err){
        throw new Error(err);
    }
}

exports.getUsers=(req,res,next)=>{
    try{
        // console.log(req.user.id);
        const groupId=req.header("groupId");
        const userId=req.user.id;
        UserGroup.findAll({where:{groupId:groupId}})
            .then(response=>{
                const users=[];
                for(let i=0;i<response.length;i++){
                    users.push(response[i].dataValues);
                }
                res.status(201).json({"users":users});
            })
            .catch(err=>{
                throw new Error(err);
            })
    } catch(err){
        throw new Error(err);
    }
}

exports.makeAdmin=async(req,res,next)=>{
    try{
        const userId=req.body.userId;
        const groupId=req.body.groupId;
        console.log(userId,groupId);
        UserGroup.findAll({where:{userId:userId,groupId:groupId}})
            .then(usergroup=>{
                usergroup[0].isAdmin=true;
                usergroup[0].save();
            })
            .catch(err=>{
                throw new Error(err);
            })
    } catch(err){
        throw new Error(err);
    }
}