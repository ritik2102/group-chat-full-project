const express=require("express");
const router=express.Router();
const userController=require('../controller/user');

router.post('/add-user',userController.postUser);
router.post('/user-login',userController.userLogin)

module.exports=router;
