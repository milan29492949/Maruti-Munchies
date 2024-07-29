const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    email : String,
    name : String,
    order_id : String,
    payment_id : String,
    items : {
        type : Array
    },
    total : Number
    
})

const Order = mongoose.model('orders', orderSchema)

module.exports = Order;