const mongoose = require('mongoose')

const jumbotronSchema = new mongoose.Schema({
    heading : String,
    sub_heading : String,
    left_top : String,
    left_center_blur : String,
    left_bottom : String,
    right_top : String,
    right_bottom : String,
    image1 : String,
    image2 : String,
    image3 : String,
    image4 : String,
})

const Jumbotron = mongoose.model('jumbotrons', jumbotronSchema)

module.exports = Jumbotron;