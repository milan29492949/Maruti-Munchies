const mongoose = require('mongoose')

const whyChoooseSchema = new mongoose.Schema({
    right_image : String,
    description_data : String,
    
})

const WhyChoose = mongoose.model('why_choose', whyChoooseSchema)

module.exports = WhyChoose;