const mongoose = require('mongoose')

const processSchema = new mongoose.Schema({
    process_name : String,
    process_description : String,
    image : String,
})

const OurProcess = mongoose.model('our_processes', processSchema)

module.exports = OurProcess;