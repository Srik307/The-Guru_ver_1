const { getuser, UpdateUserDetails,addRoutine} = require('../controllers/UserController');
const { storageprofile } = require("../database/storagehandler");
const multer = require('multer');

const uploadprofile = multer({ storage: storageprofile});

const router = require('express').Router();

router.post('/getuser', getuser);

router.post('/update', uploadprofile.single('profileImage'),UpdateUserDetails);


module.exports = router;