const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : String,
    price : String,
    description : String,
    stock : String,
    images : [String],
    class : String
})

const Product = mongoose.model('products', productSchema)

module.exports = Product;