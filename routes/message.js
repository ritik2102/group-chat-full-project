const express=require("express");
const router=express.Router();

const messageController=require('../controller/message');
const userAuthentication=require('../middleware/auth');

router.post('/add-message',userAuthentication.authenticate,messageController.postMessage);
router.get('/get-message',userAuthentication.authenticate,messageController.getMessage);
// ,userController.postMessage
module.exports=router;
