const mongoose = require("mongoose");

const AuthSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});




const UserMetaSchema = new mongoose.Schema({
  goal: [String],
  mindm: Number,
  dism: Number,
  bodym: Number,
});

const UserSchema = new mongoose.Schema({
  mob: String,
  email: String,
  dailyupdates: [String], // Assuming dailyupdates is an array of strings. Adjust if the structure is different.
  usermeta: UserMetaSchema,
  name: String,
  age: String, // Age is a string here, consider changing to Number if applicable
  sex: String,
  profession: String,
  photo: String,
  routines: [Object]
});


const RoutineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  des: {
    type: String,
    required: true
  },
  img: {
    src: {
      type: String,
    }
  },
  vi: {
    src: {
      type: String,
    }
  },
  au: {
    src: {
      type: String,
    }
  },
  streak: {
    type: Number,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  days: {
    type: [Number],
    required: true
  }
});



module.exports= {AuthSchema,UserSchema,RoutineSchema};