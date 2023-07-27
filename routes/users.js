const express=require("express");
const router=express.Router();

const userController=require('../controller/user');
const userAuthentication=require('../middleware/auth');

router.get('/getUser',userAuthentication.authenticate,userController.getUser);
router.get('/getUsers',userController.getUsers)
router.post('/add-user',userController.postUser);
router.post('/user-login',userController.userLogin)

module.exports=router;
