const mongoose = require('mongoose')

const aboutSchema = new mongoose.Schema({
    left_image : String,
    right_image : String,
    about : String,
    
})

const About = mongoose.model('abouts', aboutSchema)

module.exports = About;