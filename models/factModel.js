const mongoose = require('mongoose')

const factSchema = new mongoose.Schema({
    left_image : String,
    main_image : String,
    left_top_heading : String,
    left_top_sub_heading : String,
    left_top_svg : String,
    left_bottom_heading : String,
    left_bottom_sub_heading : String,
    left_bottom_svg : String,
    right_top_heading : String,
    right_top_sub_heading : String,
    right_top_svg : String,
    right_bottom_heading : String,
    right_bottom_sub_heading : String,
    right_bottom_svg : String,
})

const Fact = mongoose.model('facts', factSchema)

module.exports = Fact;