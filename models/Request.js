const mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema({
    name:String,
    title : String,
    email : String,
    status:String,
    ExpiryTime: String,
    Expire: Boolean
})

const RequestModel = mongoose.model("request",RequestSchema)
module.exports = RequestModel

