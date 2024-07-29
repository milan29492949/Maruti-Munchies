const mongoose = require("mongoose");
const Product = require('../models/productModel');
var session = require('express-session')
const { check,validationResult } = require('express-validator');
const Razorpay = require('razorpay');
var nodemailer = require('nodemailer');
const fs = require('fs')
const WebsiteLogo = require('../models/websiteLogoModel')
const Fact = require('../models/factModel')
const Jumbotron = require('../models/jumbotronModel');
const About = require('../models/aboutUsModel');
const OurProcess = require('../models/ourProcessModel');
const Contact = require('../models/contactModel')
const Order = require('../models/orderModel');
const WhyChoose = require('../models/whyChooseModel');

const DB = "mongodb://localhost:27017/maruti_munchies";

mongoose.connect(DB).then(() => {
    console.log("Connected to database");
})

exports.home =  async (req, resp) =>{
    
    const logo = await WebsiteLogo.findOne({})
    const jumbotron = await Jumbotron.findOne({})
    const fact = await Fact.findOne({})
    const about = await About.findOne({})
    const product = await Product.find({})
    const process = await OurProcess.find({})
    const contact = await Contact.findOne({})
    // console.log(logo)
    // console.log(req.session.user.name)
    resp.render('index', {cart : req.session.cart, wishlist : req.session.wishlist, user : req.session.user, logo:logo, jumbotron : jumbotron, fact : fact,about : about, product : product, process: process, contact : contact})
    
    
}

exports.flavours = async (req, resp) =>{
    
    const logo = await WebsiteLogo.findOne({})
    let pro = await Product.find({});
    const contact = await Contact.findOne({})
    console.log(pro.length)
    resp.status(200);
    resp.render('flavours', {pro : pro, cart : req.session.cart, wishlist : req.session.wishlist, user : req.session.user, logo:logo, contact : contact})
}

exports.add_cart = async (req,resp) => {


    const {id} = req.body;

    // let id = req.query.id;
    // console.log(id)
    
    const product = await Product.findById(id)
    let count = 0;
    for(let i = 0; i < req.session.cart.length; i++)
        {
    
            if(req.session.cart[i].product_id === id)
            {
                req.session.cart[i].quantity += 1;
    
                count++;
            }
    
        }

    

    if(count === 0){
        const cart_data = {
            product_id : id,
            product_name : product.name,
            product_description : product.description,
            product_price : product.price,
            product_image : product.images[0],
            quantity : 1
        }

        req.session.cart.push(cart_data)
    }

   

    // console.log(req.session.cart)
    // console.log(product)
    let row = "";
    let total = 0;
    for(let i = 0 ;i < req.session.cart.length; i++){
        let sub_total = 0;
        
        sub_total = sub_total + (req.session.cart[i].product_price * 1) * req.session.cart[i].quantity
        total = total + sub_total;
        row += "<tr>";
        row += `<td class="fw-bold">${req.session.cart[i].product_name}</td>`; 
        row += `<td>₹ ${req.session.cart[i].product_price}</td>`; 
        row += `<td>${req.session.cart[i].quantity}</td>`; 
        row += `<td>₹ ${sub_total}</td>`;
        row += "</tr>";
    }
    
    let total_items = req.session.cart.length;
    resp.send({total_items : total_items, row : row, total : total})
}

exports.add_wishlist = async (req, resp) => {
    const {id} = req.body;
    const product = await Product.findById(id)
    let count = 0;
    for(let i = 0; i < req.session.wishlist.length; i++)
        {
    
            if(req.session.wishlist[i].product_id === id)
            {
                req.session.wishlist[i].quantity += 1;
    
                count++;
            }
    
        }

    

    if(count === 0){
        const wishlist_data = {
            product_id : id,
            product_name : product.name,
            product_description : product.description,
            product_price : product.price,
            product_quantity : product.stock,
            product_image : product.images[0],
            quantity : 1
        }

        req.session.wishlist.push(wishlist_data)
    }

    let total_items = req.session.wishlist.length;
    resp.send({total_items : total_items});

    // resp.send(id)
}

exports.update_cart_plus = (req, resp) => {
    const {id} = req.body;

    for(let i = 0; i < req.session.cart.length; i++){
    
            if(req.session.cart[i].product_id === id)
            {
                req.session.cart[i].quantity += 1;
    
               
            }
    
    }
    
    console.log(req.session.cart)

    let row = "";
    let total = 0;
    for(let i = 0 ;i < req.session.cart.length; i++){
        let sub_total = 0;
        
        sub_total = sub_total + (req.session.cart[i].product_price * 1) * req.session.cart[i].quantity
        total = total + sub_total;
        row += "<tr>";
        row += `<td class="fw-bold">${req.session.cart[i].product_name}</td>`; 
        row += `<td>₹ ${req.session.cart[i].product_price}</td>`; 
        row += `<td>${req.session.cart[i].quantity}</td>`; 
        row += `<td>₹ ${sub_total}</td>`;
        row += "</tr>";
    }
    
    let total_items = req.session.cart.length;
    resp.send({total_items : total_items, row : row, total : total})
    resp.end();
    // resp.status(200).send({row : row})
    
}

exports.update_cart_minus = (req, resp) => {
    const {id} = req.body;

    for(let i = 0; i < req.session.cart.length; i++){
    
            if(req.session.cart[i].product_id === id)
            {
                req.session.cart[i].quantity -= 1;
    
               
            }
    
    }
    
    console.log(req.session.cart)

    let row = "";
    let total = 0;
    for(let i = 0 ;i < req.session.cart.length; i++){
        let sub_total = 0;
        
            sub_total = sub_total + (req.session.cart[i].product_price * 1) * req.session.cart[i].quantity
            total = total + sub_total;
            row += "<tr>";
            row += `<td class="fw-bold">${req.session.cart[i].product_name}</td>`; 
            row += `<td>₹ ${req.session.cart[i].product_price}</td>`; 
            row += `<td>${req.session.cart[i].quantity}</td>`; 
            row += `<td>₹ ${sub_total}</td>`;
            row += "</tr>";
        
        
        
    }
    
    let total_items = req.session.cart.length;
    resp.send({total_items : total_items, row : row, total : total})
    resp.end();
    // resp.status(200).send({row : row})
    
}

exports.delete_item = (req, resp) => {
    const {id} = req.body;

    for(let i = 0; i < req.session.cart.length; i++){
    
        if(req.session.cart[i].product_id === id)
        {
            req.session.cart.splice(i, 1);

           
        }

    }
    resp.send(id)
}

exports.delete_from_wishlist = (req, resp) => {
    const {id} = req.body;

    for(let i = 0; i < req.session.wishlist.length; i++){
    
        if(req.session.wishlist[i].product_id === id)
        {
            req.session.wishlist.splice(i, 1);

           
        }

    }
    resp.send(id)
}

exports.clear_cart = async (req, resp) => {
    const logo = await WebsiteLogo.findOne({})
    const contact = await Contact.findOne({})
    req.session.cart = [];
    resp.render('cart',{cart : req.session.cart, wishlist : req.session.wishlist, user : req.session.user, logo:logo, contact: contact})
}

exports.about = async (req, resp) =>{
    
    // if(!req.session.cart){
    //     req.session.cart = [];
    // }
    const logo = await WebsiteLogo.findOne({})
    const about = await About.findOne({})
    const fact = await Fact.findOne({})
    const contact = await Contact.findOne({})
    const why_choose = await WhyChoose.findOne({})

    resp.render('about', {cart : req.session.cart, wishlist : req.session.wishlist, user : req.session.user, logo:logo,about :about, fact : fact, contact: contact, why_choose : why_choose})
}

exports.cart = async (req, resp) =>{

    // if(!req.session.cart){
    //     req.session.cart = [];
    // }
    const logo = await WebsiteLogo.findOne({})
    const contact = await Contact.findOne({})

    resp.render('cart', {cart : req.session.cart, wishlist : req.session.wishlist, user : req.session.user, logo:logo, contact : contact})
}

exports.checkout = async (req, resp) =>{

    // if(!req.session.cart){
    //     req.session.cart = [];
    // }
    const logo = await WebsiteLogo.findOne({})
    const contact = await Contact.findOne({})

    resp.render('checkout', {cart :req.session.cart, wishlist : req.session.wishlist, user : req.session.user, logo:logo, contact: contact})
}

exports.contact = async (req, resp) =>{
    // if(!req.session.cart){
    //     req.session.cart = [];
    // }

    const contact = await Contact.findOne({})
    const logo = await WebsiteLogo.findOne({})
    resp.render('contact', {cart : req.session.cart, wishlist : req.session.wishlist, user : req.session.user, logo:logo, contact : contact})
}





exports.login = async (req, resp) => {
    if(!req.session.cart){
        req.session.cart = [];
    }

    const logo = await WebsiteLogo.findOne({})
    const contact = await Contact.findOne({})
    resp.render('login', {errors : [],cart : req.session.cart, wishlist : req.session.wishlist, user : req.session.user, logo:logo, contact : contact});
}

exports.wishlist = async (req, resp) => {

    if(!req.session.cart){
        req.session.cart = [];
    }
    const logo = await WebsiteLogo.findOne({})
    const contact = await Contact.findOne({})

    resp.render('wishlist', {cart : req.session.cart, wishlist : req.session.wishlist, user : req.session.user, logo:logo, contact : contact});
}

exports.logout = (req, resp) => {
    req.session.user = [];

    resp.redirect('/');
}

const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_6GV2nl53rmrKJO',
    key_secret: 'jbU0VoJFi4mPlEnMJAaGxxtF'
});


exports.createOrder = async(req,res)=>{
    try {
        const amount = req.body.amount*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'ravidangariya233@gmail.com'
        }

        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id:'rzp_test_6GV2nl53rmrKJO',
                        product_name:req.body.name,
                        description:req.body.description,
                        contact:"7984784539",
                        name: "Ravi Dangariya",
                        email: "ravidangariya233@gmail.com"
                    });
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong!'});
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}

exports.send_email = async (req, resp) => {

    var someDate = new Date();
    var numberOfDaysToAdd = 3;
    var delivery_date = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    var  mydate = new Date(delivery_date);

    const {order_id, fname,lname,billing_address,city, state,zip, payment_id,email} = req.body;
    let grand_total = 0;
    req.session.cart.forEach((row, index) => {
        grand_total = grand_total + ((row.quantity) * ( row.product_price *1 ))
    })
    let emailTemplate = fs.readFileSync(`${__dirname}/../emailTemplate/emailTemp.html`, 'utf-8')
    emailTemplate = emailTemplate.replace(/{%ORDER_COUNT%}/g,req.session.cart.length)
    emailTemplate = emailTemplate.replace(/{%ORDER_TOTAL%}/g,grand_total)
    emailTemplate = emailTemplate.replace(/{%ORDER_ID%}/g,order_id)
    emailTemplate = emailTemplate.replace(/{%FIRST_NAME%}/g,fname)
    emailTemplate = emailTemplate.replace(/{%LAST_NAME%}/g,lname)
    emailTemplate = emailTemplate.replace(/{%BILLING_ADDRESS%}/g,billing_address)
    emailTemplate = emailTemplate.replace(/{%CITY%}/g,city)
    emailTemplate = emailTemplate.replace(/{%STATE%}/g,state)
    emailTemplate = emailTemplate.replace(/{%ZIP%}/g,zip)
    emailTemplate = emailTemplate.replace(/{%DELIVERY_DATE%}/g,mydate)

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host : "smtp.gmail.com",
        port : 587,
        auth: {
          user: 'ravireview233@gmail.com',
          pass: 'wlet eucp reke tfzh'
        }
      });

      var mailOptions = {
        from: 'Maruti Munchies <ravireview233@gmail.com>',
        to: 'ravidangariya233@gmail.com',
        subject: 'Your order Confimed - Maruti Munchies',
        html : emailTemplate
        // text: 'That was easy!'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      const order = Order({email : email, name : fname+" "+lname, order_id : order_id, payment_id : payment_id, items : req.session.cart, total:grand_total})
      await order.save();
      req.session.cart = [];
}


