const express = require('express');
const adminController = require('../controllers/adminController');
var multer = require('multer')
const Product = require('../models/productModel');
const WebsiteLogo = require('../models/websiteLogoModel')
const mongoose = require('mongoose');
const {check, validationResult} = require('express-validator');
const path = require("path");
const fs = require("fs");
const isLoggedIn = require('../middlewares/admin/isLoggedIn')
const fileUpload = require('express-fileupload');
const singleImageUpload = require('../imageUpload/imageUpload');
const ourProcess = require('../models/ourProcessModel');
const Jumbotron = require('../models/jumbotronModel')
const jumbotronUpload = require('../imageUpload/uploadJumbotron');
const factUpload = require('../imageUpload/factImageUpload')
const Fact = require('../models/factModel');
const AboutImageUpload = require('../imageUpload/aboutImageUpload');
const About = require('../models/aboutUsModel');
const whyChooseUpload = require('../imageUpload/whyChoose');
const WhyChoose = require('../models/whyChooseModel');


const DB = "mongodb://localhost:27017/maruti_munchies";

mongoose.connect(DB).then(() => {
    console.log("Connected to database");
})

const route = express.Router();

route.route('/').get(adminController.login)
route.route('/dashboard').get(isLoggedIn.isLoggedIn,adminController.dashboard)
route.route('/add_product').get(isLoggedIn.isLoggedIn,adminController.add_product)


// route.route('/insert_product').post(adminController.insert_product)
const targetPath = path.join(__dirname, "../public/images/khakhra-flavour/");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, targetPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage }).fields([ 
    { 
      name: "regular_image", 
      maxCount: 1, 
    }, 
    { 
        name: "mobile_image", 
        maxCount: 1, 
      }, 
    
  ])

  uploadTwo = multer({ storage: storage }).single('logo')

route.post('/insert_product',upload,
[
    [
        check('name').notEmpty().withMessage("Name is required"),
        check('price').notEmpty().withMessage("Price is required"),
        check('description').notEmpty().withMessage("Description is required"),
        check('stock').notEmpty().withMessage("Stock is required"),
        // check('regular_image').notEmpty().withMessage("Regular Image is required"),
        // check('mobile_image').notEmpty().withMessage("Mobile Image is required"),
    
        
    ]
], 
async (req, resp) => {
    console.log(req.files)
    const errors = validationResult(req);
    // console.log(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(req.files)).regular_image))[0].filename);
    // const fileNames = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(req.files)).regular_image))
    const regular_image = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(req.files)).regular_image))[0].filename;
    const mobile_image = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(req.files)).mobile_image))[0].filename;
    // console.log(JSON.parse(JSON.stringify(req.files)))
    // const regular_image = JSON.parse(JSON.stringify(req.files)).regular_image.name;
    // const mobile_image = JSON.parse(JSON.stringify(req.files)).mobile_image.name;

   
    
    if(!errors.isEmpty()){
        console.log(errors.mapped())
        resp.render('admin/add_product', {errors : errors.mapped()});
    }else{
        
        var upload = multer({ storage: storage })
        console.log("mobile image "+mobile_image)
        const {name, price, description,stock} = req.body;
        // console.log(regular_image);
        const imagesArr = [
            "images/khakhra-flavour/"+regular_image,
            "images/khakhra-flavour/"+mobile_image
        ]
        // const data = [{'name' : name, 'price' : price, 'description' : description, 'stock' : stock, 'images' : images, 'class' : null}]
        const product = Product({name : name, price : price , description : description, stock : stock, images : imagesArr, class : ''})
        await product.save();
        console.log(product)
        
        const allProduct = await Product.find({});
        resp.render("admin/view_product", {allProduct : allProduct});
        
    }
})

route.route('/view_product').get(isLoggedIn.isLoggedIn,adminController.view_product)
route.route('/admin_register').get(adminController.adminRegister)
route.route('/save_admin').post(adminController.save_admin)
route.route('/edit_product/:id').get(isLoggedIn.isLoggedIn,adminController.edit_product)

// route.route('/update_product/:id').post(upload,adminController.update_product)
route.post('/update_product/:id', upload, async (req, resp) => {
    const id = req.params.id;
    const {name, price,description,stock} = req.body
    if(req.files){
        if(JSON.parse(JSON.stringify(req.files)).regular_image !== undefined){
            const regular_image = JSON.parse(JSON.stringify(req.files)).regular_image[0].filename;
            const {old_mobile_image} = req.body;

           

            const newImgArr = [
                "images/khakhra-flavour/"+regular_image,
                old_mobile_image
            ]
            const filter = {"_id" : id};
            const data = {
                name : name,
                price : price,
                description : description,
                stock : stock,
                images : newImgArr
            }
            const product = await Product.findOneAndUpdate(filter, data);
            const allProduct = await Product.find({})
            resp.redirect('/backoffice/view_product')
            // resp.send(product)
        }else if(JSON.parse(JSON.stringify(req.files)).mobile_image !== undefined){
            const mobile_image = JSON.parse(JSON.stringify(req.files)).mobile_image[0].filename;
            const {old_regular_image} = req.body;

           

            const newImgArr = [
                old_regular_image,
                "images/khakhra-flavour/"+mobile_image
            ]
            const filter = {"_id" : id};
            const data = {
                name : name,
                price : price,
                description : description,
                stock : stock,
                images : newImgArr
            }
            const product = await Product.findOneAndUpdate(filter, data);

            const allProduct = await Product.find({})
            resp.redirect('/backoffice/view_product')
        }else{
            const filter = {"_id" : id};
            const data = {
                name : name,
                price : price,
                description : description,
                stock : stock,
            }
            const product = await Product.findOneAndUpdate(filter, data);
            const allProduct = await Product.find({})
            resp.redirect('/backoffice/view_product')
        }
        // console.log(JSON.parse(JSON.stringify(req.files)).regular_image[0].filename)
        // console.log(JSON.parse(JSON.stringify(req.files)).mobile_image)
    }
})



route.route('/delete_product').post(adminController.delete_product)


adminLoginRules = [
    [
        check('email').notEmpty().withMessage("Email is required"),
        check('password').notEmpty().withMessage("Password is required"),
    ]
];

route.post('/check_login',adminLoginRules, adminController.check_login)

route.route('/logout').get(adminController.logout)

route.route('/add_logo').get(isLoggedIn.isLoggedIn,adminController.add_logo);

route.route('/manage_logo').get(isLoggedIn.isLoggedIn,adminController.manage_logo)

route.post('/insert_logo', uploadTwo, async (req, resp) => {
    const logo = req.file.filename;
    
    const savedLogo = WebsiteLogo({image : 'images/khakhra-flavour/'+logo})

    await savedLogo.save()

    resp.redirect('/backoffice/manage_logo')

})

route.route('/delete_logo').post(isLoggedIn.isLoggedIn,adminController.delete_logo);

route.route('/edit_logo/:id').get(isLoggedIn.isLoggedIn,adminController.edit_logo)

route.post('/update_logo/:id', uploadTwo, async (req, resp) => {
    const logo = req.file.filename;
    const id = req.params.id;
    
    const filter = {"_id" : id};
            const data = {
                image : 'images/khakhra-flavour/'+logo
            }
            const product = await WebsiteLogo.findOneAndUpdate(filter, data);

            resp.redirect('/backoffice/manage_logo');

})

route.route('/add_our_process').get(isLoggedIn.isLoggedIn,adminController.add_our_process)

route.post('/insert_our_process',singleImageUpload.single('process_img'), async (req, resp) => {
    const {process_name, process_description} = req.body;
    const processData = {
        process_name : process_name,
        process_description : process_description,
        image : "images/our_process/"+req.file.filename
    }

    const process = ourProcess(processData)
    await process.save();

    resp.redirect('/backoffice/manage_our_process');
})

route.route('/manage_our_process').get(isLoggedIn.isLoggedIn,adminController.manage_our_process);
route.route('/delete_our_process').post(isLoggedIn.isLoggedIn,adminController.delete_our_process)
route.route('/edit_our_process/:id').get(isLoggedIn.isLoggedIn,adminController.edit_our_process)

route.post('/update_our_process/:id',singleImageUpload.single('process_img'), async (req, resp) => {
    const id = req.params.id;
    const {process_name, process_description} = req.body;
    if(req.file){
        const processData = {
            process_name : process_name,
            process_description : process_description,
            image : "images/our_process/"+req.file.filename
        }

        const filter = {'_id' : id};
        const process = await ourProcess.findOneAndUpdate(filter, processData)
        
    }else{
        const processData = {
            process_name : process_name,
            process_description : process_description,
            
        }

        const filter = {'_id' : id};
        const process = await ourProcess.findOneAndUpdate(filter, processData)
       
    }
    
    
    

    resp.redirect('/backoffice/manage_our_process');
})

//contact details

route.route('/add_contact').get(isLoggedIn.isLoggedIn,adminController.add_contact)
route.route('/insert_contact').post(isLoggedIn.isLoggedIn,adminController.insert_contact)
route.route('/manage_contact').get(isLoggedIn.isLoggedIn,adminController.manage_contact)
route.route('/edit_contact/:id').get(isLoggedIn.isLoggedIn,adminController.edit_contact)
route.route('/update_contact/:id').post(isLoggedIn.isLoggedIn,adminController.update_contact);
route.route('/delete_contact').post(isLoggedIn.isLoggedIn,adminController.delete_contact)


//jumbotron

route.route('/add_jumbotron').get(isLoggedIn.isLoggedIn,adminController.add_jumbotron);
route.post('/insert_jumbotron',jumbotronUpload.fields([ 
    {
        name: "jumbotron_left_top", 
        maxCount: 1,
    },
    {
        name: "jumbotron_left_center_blur", 
        maxCount: 1,
    },
    {
        name: "jumbotron_left_bottom", 
        maxCount: 1,
    },
    {
        name: "jumbotron_right_top", 
        maxCount: 1,
    },
    {
        name: "jumbotron_right_bottom", 
        maxCount: 1,
    },
    { 
      name: "jumbotron_img_1", 
      maxCount: 1, 
    }, 
    { 
        name: "jumbotron_img_2", 
        maxCount: 1, 
    },
    { 
        name: "jumbotron_img_3", 
        maxCount: 1, 
    },
    { 
        name: "jumbotron_img_4", 
        maxCount: 1, 
    }, 
    
  ]), async (req, resp) => {
    const {heading, sub_heading} = req.body;
    const left_top = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_left_top[0].filename;
    const left_center_blur = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_left_center_blur[0].filename;
    const left_bottom = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_left_bottom[0].filename;
    const right_top = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_right_top[0].filename;
    const right_bottom = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_right_bottom[0].filename;

    const jumbotron_img_1 = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_img_1[0].filename;
    const jumbotron_img_2 = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_img_2[0].filename;
    const jumbotron_img_3 = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_img_3[0].filename;
    const jumbotron_img_4 = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_img_4[0].filename;

    const jumbotron = Jumbotron({heading : heading, sub_heading : sub_heading,image1 : jumbotron_img_1,image2:jumbotron_img_2,image3:jumbotron_img_3,
        image4 : jumbotron_img_4,
        left_top : left_top,
        left_center_blur : left_center_blur,
        left_bottom : left_bottom,
        right_top : right_top,
        right_bottom : right_bottom,
    });

    await jumbotron.save();

    resp.redirect('/backoffice/manage_jumbotron')
  })

  route.route('/manage_jumbotron').get(adminController.manage_jumbotron)
  route.route('/delete_jumbotron').post(adminController.delete_jumbotron);
  route.route('/edit_jumbotron/:id').get(adminController.edit_jumbotron)
  route.route('/edit_jumbotron/:id').get(adminController.edit_jumbotron)

  route.post('/update_jumbotron/:id',jumbotronUpload.fields([ 
    {
        name: "jumbotron_left_top", 
        maxCount: 1,
    },
    {
        name: "jumbotron_left_center_blur", 
        maxCount: 1,
    },
    {
        name: "jumbotron_left_bottom", 
        maxCount: 1,
    },
    {
        name: "jumbotron_right_top", 
        maxCount: 1,
    },
    {
        name: "jumbotron_right_bottom", 
        maxCount: 1,
    },
    { 
      name: "jumbotron_img_1", 
      maxCount: 1, 
    }, 
    { 
        name: "jumbotron_img_2", 
        maxCount: 1, 
    },
    { 
        name: "jumbotron_img_3", 
        maxCount: 1, 
    },
    { 
        name: "jumbotron_img_4", 
        maxCount: 1, 
    }, 
    
  ]), async (req, resp) => {
    const {heading, sub_heading} = req.body;
    const left_top = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_left_top[0].filename;
    const left_center_blur = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_left_center_blur[0].filename;
    const left_bottom = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_left_bottom[0].filename;
    const right_top = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_right_top[0].filename;
    const right_bottom = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_right_bottom[0].filename;

    const jumbotron_img_1 = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_img_1[0].filename;
    const jumbotron_img_2 = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_img_2[0].filename;
    const jumbotron_img_3 = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_img_3[0].filename;
    const jumbotron_img_4 = "images/jumbotron/"+JSON.parse(JSON.stringify(req.files)).jumbotron_img_4[0].filename;

    const jumbotronData = {heading : heading, sub_heading : sub_heading,image1 : jumbotron_img_1,image2:jumbotron_img_2,image3:jumbotron_img_3,
        image4 : jumbotron_img_4,
        left_top : left_top,
        left_center_blur : left_center_blur,
        left_bottom : left_bottom,
        right_top : right_top,
        right_bottom : right_bottom,
    };

    const id = req.params.id;
    const filter = {'_id' : id}
    await Jumbotron.findOneAndUpdate(filter, jumbotronData);

    resp.redirect('/backoffice/manage_jumbotron')
  })


  //fact section

  route.route('/add_fact').get(adminController.add_fact)
  route.post('/insert_fact', factUpload.fields([ 
    {
        name: "left_image", 
        maxCount: 1,
    },
    {
        name: "main_image", 
        maxCount: 1,
    },
    
    
  ]),async (req, resp) => {
    const left_image = "images/fact/"+JSON.parse(JSON.stringify(req.files)).left_image[0].filename;
    const main_image = "images/fact/"+JSON.parse(JSON.stringify(req.files)).main_image[0].filename;
    const {left_top_heading,left_top_sub_heading,left_top_svg,
        left_bottom_heading,left_bottom_sub_heading,left_bottom_svg,
        right_top_heading,right_top_sub_heading,right_top_svg,
        right_bottom_heading,right_bottom_sub_heading,right_bottom_svg
    } = req.body;

    const fact = Fact({
        left_image : left_image,
        main_image : main_image,
        left_top_heading : left_top_heading,
        left_top_sub_heading : left_top_sub_heading,
        left_top_svg : left_top_svg,
        left_bottom_heading : left_bottom_heading,
        left_bottom_sub_heading : left_bottom_sub_heading,
        left_bottom_svg : left_bottom_svg,
        right_top_heading : right_top_heading,
        right_top_sub_heading : right_top_sub_heading,
        right_top_svg : right_top_svg,
        right_bottom_heading : right_bottom_heading,
        right_bottom_sub_heading : right_bottom_sub_heading,
        right_bottom_svg : right_bottom_svg,

    })

    await fact.save();

    resp.redirect('/backoffice/manage_fact')

    
  })

  route.route('/manage_fact').get(isLoggedIn.isLoggedIn,adminController.manage_fact)
  route.route('/edit_fact/:id').get(isLoggedIn.isLoggedIn,adminController.edit_fact)

  route.post('/update_fact/:id', factUpload.fields([ 
    {
        name: "left_image", 
        maxCount: 1,
    },
    {
        name: "main_image", 
        maxCount: 1,
    },
    
    
  ]),async (req, resp) => {
    const left_image = "images/fact/"+JSON.parse(JSON.stringify(req.files)).left_image[0].filename;
    const main_image = "images/fact/"+JSON.parse(JSON.stringify(req.files)).main_image[0].filename;
    const {left_top_heading,left_top_sub_heading,left_top_svg,
        left_bottom_heading,left_bottom_sub_heading,left_bottom_svg,
        right_top_heading,right_top_sub_heading,right_top_svg,
        right_bottom_heading,right_bottom_sub_heading,right_bottom_svg
    } = req.body;

    const factData = {
        left_image : left_image,
        main_image : main_image,
        left_top_heading : left_top_heading,
        left_top_sub_heading : left_top_sub_heading,
        left_top_svg : left_top_svg,
        left_bottom_heading : left_bottom_heading,
        left_bottom_sub_heading : left_bottom_sub_heading,
        left_bottom_svg : left_bottom_svg,
        right_top_heading : right_top_heading,
        right_top_sub_heading : right_top_sub_heading,
        right_top_svg : right_top_svg,
        right_bottom_heading : right_bottom_heading,
        right_bottom_sub_heading : right_bottom_sub_heading,
        right_bottom_svg : right_bottom_svg,

    }

    const id = req.params.id;
    const filter = {'_id' : id}

    await Fact.findOneAndUpdate(filter,factData);

    resp.redirect('/backoffice/manage_fact')

    
  })

  route.route('/delete_fact/').post(isLoggedIn.isLoggedIn,adminController.delete_fact)

  //about us

  route.route('/add_about').get(isLoggedIn.isLoggedIn,adminController.add_about)

  route.post('/insert_about', AboutImageUpload.fields([ 
    {
        name: "left_image", 
        maxCount: 1,
    },
    {
        name: "right_image", 
        maxCount: 1,
    },
    
    
    
  ]),async (req, resp) => {
    const left_image = "images/about/"+JSON.parse(JSON.stringify(req.files)).left_image[0].filename;
    const right_image = "images/about/"+JSON.parse(JSON.stringify(req.files)).right_image[0].filename;
    const {about_us} = req.body;

    const about = About({
        left_image : left_image,
        right_image : right_image,
        about : about_us,
        

    })

    await about.save();

    resp.redirect('/backoffice/manage_about')

    
  })

  route.route('/manage_about').get(isLoggedIn.isLoggedIn,adminController.manage_about)
  route.route('/edit_about/:id').get(isLoggedIn.isLoggedIn,adminController.edit_about)

  route.post('/update_about/:id', AboutImageUpload.fields([ 
    {
        name: "left_image", 
        maxCount: 1,
    },
    {
        name: "right_image", 
        maxCount: 1,
    },
    
    
    
  ]),async (req, resp) => {
    const left_image = "images/about/"+JSON.parse(JSON.stringify(req.files)).left_image[0].filename;
    const right_image = "images/about/"+JSON.parse(JSON.stringify(req.files)).right_image[0].filename;
    const {about_us} = req.body;

    const aboutData = {
        left_image : left_image,
        right_image : right_image,
        about : about_us,
    }

    const id = req.params.id;
    const filter = {'_id' : id}
    await About.findOneAndUpdate(filter,aboutData);

    resp.redirect('/backoffice/manage_about')

    
  })

  route.route('/delete_about').post(adminController.delete_about)


  //why choose us
  route.route('/add_why_choose').get(adminController.add_why_choose);

  route.post('/insert_why_choose', whyChooseUpload.single(
    
    
     "right_image"
      
    
    
  ),async (req, resp) => {
    // console.log(req.file)
    const right_image = req.file.filename;
    const { description_data } = req.body;
    console.log("description"+ description_data)

   

    const choose = WhyChoose({right_image : "images/why_choose/"+right_image, description_data : description_data})

    await choose.save();

    resp.redirect('/backoffice/manage_why_choose')

    
  })

  route.route('/manage_why_choose').get(adminController.manage_why_choose)
  route.route('/edit_why_choose/:id').get(adminController.edit_why_choose)

  route.post('/update_why_choose/:id', whyChooseUpload.single(
    
    
    "right_image"
     
   
   
 ),async (req, resp) => {
   // console.log(req.file)
   const right_image = req.file.filename;
   const { description_data } = req.body;

    const id = req.params.id;
    const filter = {'_id' : id};
    const Data = {
        right_image : right_image,
        description_data : description_data
    }

   const choose = WhyChoose.findOneAndUpdate(filter, Data)


   resp.redirect('/backoffice/manage_why_choose')

   
 })

 route.route('/delete_why_choose').post(adminController.delete_why_choose)

module.exports = route;