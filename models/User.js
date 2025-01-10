const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:String,
    place:String,
    age:String,
    email:String,
    password : String,
    education : String,
    contact : String,
    phone : String,
    NoOfBooks : Number,
    membershipPlan: { type: String, default: '' }, 
    membershipStartDate: { type: Date, default: null },  
    membershipExpiryDate: { type: Date, default: null }

})

const UserModel = mongoose.model("users",UserSchema)
module.exports = UserModel

