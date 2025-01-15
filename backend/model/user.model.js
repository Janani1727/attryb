const mongoose = require("mongoose");


const userModelSchema = mongoose.Schema({
    
  name: { 
    type: String,
     required: true 
    },
  email: {
     required: true,
      type: String 
    },
  password: { 
    required: true,
     type: String 
    },
  profilePic:{
    type:String
}
});

const UserModel = mongoose.model("user", userModelSchema);

module.exports = { UserModel };