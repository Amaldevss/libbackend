const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({ 
    id:String,
    title:String,
    author:String,
    genre:String,
    publicationYear : String,
    isbn : String,
    url : String,
    rentalStatus:Boolean,
    likes:Number,
    comments:String
})

const BookModel = mongoose.model("books",BookSchema)
module.exports = BookModel