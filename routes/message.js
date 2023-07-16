const express=require("express");
const router=express.Router();

const messageController=require('../controller/message');
const userAuthentication=require('../middleware/auth');

router.post('/add-message',userAuthentication.authenticate,messageController.postMessage);
// ,userController.postMessage
module.exports=router;
