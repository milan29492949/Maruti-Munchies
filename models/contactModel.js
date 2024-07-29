const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    address : String,
    mobile : String,
    email : String,
})

const Contact = mongoose.model('contacts', contactSchema)

module.exports = Contact;