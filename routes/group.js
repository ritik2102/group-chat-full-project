const express=require("express");
const router=express.Router();

const groupController=require('../controller/group');
const userAuthentication=require('../middleware/auth');

router.post('/addGroup',userAuthentication.authenticate,groupController.addGroup);
router.post("/addMember",groupController.addMember);
router.post("/removeMember",groupController.removeMember);
router.post("/makeAdmin",groupController.makeAdmin);
router.get("/isAdmin",userAuthentication.authenticate,groupController.isAdmin);
router.get("/getGroups",userAuthentication.authenticate,groupController.getGroups);
router.get("/getUsers",userAuthentication.authenticate,groupController.getUsers);

module.exports=router;