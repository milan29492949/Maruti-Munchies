const mongoose = require('mongoose')

const websiteLogoSchema = new mongoose.Schema({
    image : String,
    
})

const WebsiteLogo = mongoose.model('webiste_logos', websiteLogoSchema)

module.exports = WebsiteLogo;