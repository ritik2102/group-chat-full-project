const express=require("express");
const router=express.Router();

const groupController=require('../controller/group');
const userAuthentication=require('../middleware/auth');

router.post('/addGroup',userAuthentication.authenticate,groupController.addGroup);
router.post("/addMember",groupController.addMember);
router.get("/getGroups",userAuthentication.authenticate,groupController.getGroups);

module.exports=router;