const {User,Auth}=require('../database/model');
const bcrypt = require('bcryptjs');
const {generateToken,verifyToken} = require('../middlewares/AuthToken');
const {ObjectID} = require('mongodb');

const getuser =async (req, res) => {
    try {
        let token = req.headers.authorization;
        console.log(token);
        
        token=token.split(' ')[1];
        let user_id=await verifyToken(token);
        console.log(user_id.id);
        let user = await User.findById(user_id.id);
        console.log(user,'hgv');
        res
            .status(200)
            .json({msg:"done",user:user});
    }
    catch (err) {
        console.error(err,"lll");
        res
            .status(500)
            .send('Server Error');
    }
}


const UpdateUserDetails=async (req,res)=>{
    try {
        let token = req.headers.authorization;
        token=token.split(' ')[1];
        let user_id=await verifyToken(token);
        let user_data = req.body;
        let photo
        if(req.file){
        photo=req.file.path.split('uploads')[1];
        photo=photo.replace(/\\/g, "/");
        user_data.photo = photo
        }
        await
        User.updateOne({_id:user_id.id}, user_data);
        res
            .status(200)
            .json({msg: 'User Details Updated',photo:photo||""});
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .send('Server Error');
    }
}




module.exports={getuser,UpdateUserDetails};
