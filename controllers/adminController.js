const express = require('express');
const Product = require("../models/productModel");
var flash = require('connect-flash');
var multer = require('multer')
const Admin = require('../models/adminModel')
const WebsiteLogo = require('../models/websiteLogoModel');
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const fileUpload = require('express-fileupload');
var session = require('express-session');
const {check, validationResult} = require('express-validator');
var flash = require('connect-flash');
const ourProcess = require('../models/ourProcessModel');
const Contact = require('../models/contactModel');
const Jumbotron = require('../models/jumbotronModel');
const Fact = require('../models/factModel');
const About = require('../models/aboutUsModel');
const WhyChoose = require('../models/whyChooseModel');
const whyChooseUpload = require('../imageUpload/whyChoose');

const app = express();
app.use(fileUpload());

exports.login = (req, resp) => {
    resp.render('admin/login', {errors : []});
}

exports.dashboard = (req, resp) => {
    resp.render('admin/dashboard');
}

exports.add_product = (req, resp) => {
    
    resp.render('admin/add_product', {errors : []});
}

exports.view_product = async (req, resp) => {
    const allProduct = await Product.find({})
    resp.render("admin/view_product", {allProduct : allProduct});
}

exports.adminRegister = (req, resp) => {
    resp.render('admin/register');
}

exports.save_admin = async (req, resp) => {
    const {email, password,username} = req.body;
    const admin = await Admin.findOne({email});
    console.log(admin)
    if(admin){
        req.flash('exist', 'Email Already Exist');
        resp.locals.message = req.flash();
        resp.render('admin/register');
    }else{
        const admin = new Admin(req.body);
            
        const salt = await bcrypt.genSalt(10);

        admin.password = await bcrypt.hash(admin.password, salt);

        admin.save();
            
        req.session.admin = admin;

        resp.redirect('dashboard');
    }
}

exports.edit_product = async (req, resp) => {
    const id = req.params.id
    
    const product = await Product.findOne({'_id':id})
    // console.log(product)

    resp.render('admin/edit_product', {product : product});
}



// exports.update_product = async (req, resp) => {
//     console.log(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(req.files)).regular_image))[0].filename);
//     const id = req.params.id;
    
//     if(JSON.parse(JSON.stringify(req.files)) !== null){
//         if(JSON.parse(JSON.stringify(req.files)).regular_image !== undefined){
//             console.log(JSON.parse(JSON.stringify(req.files)).regular_image)
            
            
//             const product = await Product.findOne({'_id' : id})
//             let oldImages = [];
//             oldImages = product.images;
//             let newImageArr = [

//             ]
//         }
//         if(JSON.parse(JSON.stringify(req.files)).mobile_image !== undefined){
//             resp.send("mobile image empty")
//         }
        
//     }else{
        
//     }
    
// }

exports.delete_product = async (req, resp) => {
    const {id} = req.body;
    await Product.findByIdAndDelete(id);

    resp.redirect('/backoffice/view_product')
}

exports.check_login = async (req, resp) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        resp.render('admin/login', {errors : errors.mapped()})
    }else{
        const {email, password} = req.body;
        const admin = await Admin.findOne({email}).select('+password')
        console.log(admin)
        if(admin !== null){
            const auth = await bcrypt.compare(password , admin.password)
            if(!auth){
                req.flash('fail', 'Incorrect Username and Password');
                resp.locals.message = req.flash();
                resp.redirect('/backoffice/');
            }else{
                req.session.admin = admin;
                resp.redirect('/backoffice/dashboard');
                // resp.render('index', {cart : req.session.cart, wishlist : req.session.wishlist, user : req.session.user})
            }
            
        }else{
                req.flash('fail', 'Email not found in database');
                resp.locals.message = req.flash();
                resp.redirect('/backoffice/');
        }
    }
    
}

exports.logout = (req, resp) => {
    req.session.admin = [];

    resp.redirect('/backoffice/')
}

exports.add_logo = (req, resp) => {
    resp.render('admin/logo/add_logo');
}

exports.manage_logo = async (req, resp) => {
    const logo = await WebsiteLogo.find({})
    resp.render('admin/logo/manage_logo', {logo : logo})
}

exports.delete_logo = async (req ,resp) => {
    const {id} = req.body;
    await WebsiteLogo.findByIdAndDelete(id);

    resp.redirect('/backoffice/manage_logo')
}

exports.edit_logo = async (req, resp) => {
    const id = req.params.id;

    const logo = await WebsiteLogo.findOne({'_id' :id})

    resp.render('admin/logo/edit_logo', {logo : logo});
}

exports.add_our_process = (req, resp) => {
    resp.render('admin/our_process/add_our_process');
}

exports.manage_our_process = async (req, resp) => {
    const processes = await ourProcess.find({});

    resp.render('admin/our_process/manage_process', {processes : processes})
}

exports.delete_our_process = async (req, resp) => {
    const {id} = req.body;

    await ourProcess.findByIdAndDelete(id);

    resp.redirect('/backoffice/manage_our_process')
}

exports.edit_our_process = async (req, resp) => {
    const id = req.params.id;

    const our_process = await ourProcess.findOne({'_id' :id})

    resp.render('admin/our_process/edit_our_process', {our_process : our_process})
}

exports.add_contact = (req, resp) => {
    resp.render('admin/contact/add_contact');
}

exports.insert_contact = async(req, resp) => {
    const {address, mobile, email} = req.body;

    const contact = Contact({address: address, mobile : mobile, email : email})
    await contact.save();

    resp.redirect('manage_contact')


}

exports.manage_contact = async (req, resp) => {
    const contacts = await Contact.find({});

    resp.render("admin/contact/manage_contact", {contacts : contacts});
}

exports.edit_contact = async (req, resp) => {
    const id = req.params.id;
    

    const contact = await Contact.findOne({'_id':id})

    resp.render('admin/contact/edit_contact', {contact : contact});
}

exports.update_contact = async (req, resp) => {
    const id = req.params.id;
    const {address, mobile, email } = req.body;

    const filter = {'_id' : id};
    const data = {address : address, mobile : mobile, email : email};

    const contact = await Contact.findOneAndUpdate(filter, data);

    resp.redirect('/backoffice/manage_contact');
}

exports.delete_contact = async (req, resp) => {
    const {id} = req.body;

    await Contact.findByIdAndDelete(id);

    resp.redirect('/backoffice/manage_contact');
}

exports.add_jumbotron = (req, resp) => {
    resp.render('admin/jumbotron/add_jumbotron')
}

exports.manage_jumbotron = async (req, resp) => {
    const jumbotron = await Jumbotron.find({});

    resp.render('admin/jumbotron/manage_jumbotron', {jumbotron : jumbotron});
}

exports.delete_jumbotron = async (req, resp) => {
    const {id} = req.body;
    await Jumbotron.findByIdAndDelete(id);

    resp.redirect('/backoffice/manage_jumbotron')
}

exports.edit_jumbotron = async (req, resp) => {
    const id = req.params.id;
    const jumbotron = await Jumbotron.findOne({'_id':id})

    resp.render('admin/jumbotron/edit_jumbotron', {jumbotron : jumbotron});

}

//fact section

exports.add_fact = (req, resp) => {
    resp.render('admin/fact/add_fact');
}

exports.manage_fact = async (req, resp) => {
    const fact = await Fact.find({})
    resp.render('admin/fact/manage_fact', {fact : fact});
}

exports.edit_fact = async (req, resp) => {
    const id = req.params.id;
    const fact = await Fact.findOne({'_id' : id})
    resp.render('admin/fact/edit_fact', {fact : fact});
}

exports.delete_fact = async (req, resp) => {
    const {id} = req.body;
    await Fact.findByIdAndDelete(id);

    resp.redirect('/backoffice/manage_fact')
}

//about us

exports.add_about = (req, resp) => {
    resp.render("admin/about/add_about");
}

exports.manage_about = async (req, resp) => {
    const about = await About.find({});
    resp.render("admin/about/manage_about", {about : about});
}

exports.edit_about = async (req, resp) => {
    const id = req.params.id;
    const about = await About.findOne({'_id' : id})
    resp.render('admin/about/edit_about', {about : about});
}

exports.delete_about = async (req, resp) => {
    const {id} = req.body;
    await About.findByIdAndDelete(id);

    resp.redirect('/backoffice/manage_about')
}

//why choose us

exports.add_why_choose = (req, resp) => {
    resp.render('admin/why_choose/add_why_choose');
}

exports.manage_why_choose = async (req, resp) => {
    const whychoose = await WhyChoose.find({})
    resp.render('admin/why_choose/manage_why_choose', {whychoose : whychoose});
}

exports.edit_why_choose = async (req, resp) => {
    const id = req.params.id;

    const why_choose = await WhyChoose.findOne({'_id' : id})

    resp.render('admin/why_choose/edit_why_choose', {why_choose : why_choose})
}

exports.delete_why_choose = async (req, resp) => {
    const {id} = req.body;
    await WhyChoose.findByIdAndDelete(id);

    resp.redirect('/backoffice/manage_why_choose')
}