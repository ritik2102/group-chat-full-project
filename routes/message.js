const express=require("express");
const router=express.Router();
const Message = require('../model/message');
// Handling multimedia chat files upload
const multer=require("multer");
const multerS3=require("multer-s3");
const AWS=require("aws-sdk");

const messageController=require('../controller/message');
const userAuthentication=require('../middleware/auth');

router.get('/get-message',userAuthentication.authenticate,messageController.getMessage);
router.post('/add-message',userAuthentication.authenticate,messageController.postMessage);



// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

// Configure multer to upload files directly to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read', // Set the ACL for the uploaded files
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null,file.originalname);
    }
  })
});


router.post('/upload', userAuthentication.authenticate,upload.single('media'),async (req, res) => {
  // Accessing the actual file:
  const file = req.file; // The 'media' field name specified in the FormData

  console.log(file);
  // If no file was uploaded, send an error response
  if (!file) {
    return res.status(400).json({ message: 'No file provided.' });
  }

  // Accessing the type of file:
  const fileType = file.mimetype;

  // Accessing the name of the file:
  const fileName = file.originalname;

  // The file URL on S3
  const fileUrl = file.location;

  const userId=req.user.id;
  const userName=req.user.name;
  const groupId=req.header("groupId");

  console.log(userId,groupId,userName,fileUrl,fileType);

  Message.create({userId:userId,groupId:groupId,userName:userName,content:fileUrl,type:fileType,timestamp:new Date()})
    .then(response=>{
        res.status(201).json({userName:userName,content:fileUrl,type:fileType});
    })
    .catch(err=>{
        throw new Error(err);
    })
  //console.log(fileType,fileName,fileUrl);
  // Handle the uploaded file as needed (e.g., save to database, process, etc.)
  // For demonstration purposes, we'll just send a success response back.
  
});

module.exports=router;
