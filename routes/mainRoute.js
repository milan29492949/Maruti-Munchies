const express = require('express');
const mainController = require('../controllers/mainController');
const initCart = require('../middlewares/cartMiddleware');
const isLoggedIn = require('../middlewares/cartMiddleware');
const isAuth = require('../middlewares/authMiddleware');
const checkError = require('../middlewares/validationMiddleware');
const {check, validationResult} = require('express-validator');
const User = require('../models/usersModel');
const bcrypt = require("bcrypt");
var session = require('express-session');
var flash = require('connect-flash');


const route = express.Router();

route.route('/about').get(isLoggedIn.isLoggedIn,initCart.initCart,initCart.initWishlist,mainController.about)
route.route('/cart').get(isLoggedIn.isLoggedIn,initCart.initCart,initCart.initWishlist,mainController.cart)
route.route('/checkout').get(isLoggedIn.isLoggedIn,initCart.initCart,initCart.initWishlist,isAuth.isAuth,mainController.checkout)
route.route('/contact').get(isLoggedIn.isLoggedIn,initCart.initCart,initCart.initWishlist,mainController.contact)
route.route('/flavours').get(isLoggedIn.isLoggedIn,initCart.initCart,initCart.initWishlist,mainController.flavours)
route.route('/').get(isLoggedIn.isLoggedIn,initCart.initCart,initCart.initWishlist,mainController.home)
route.route('/login').get(isLoggedIn.isLoggedIn,initCart.initCart,initCart.initWishlist,mainController.login)
route.route('/wishlist').get(isLoggedIn.isLoggedIn,initCart.initCart,initCart.initWishlist,mainController.wishlist)

route.route('/add_cart').post(initCart.initCart,initCart.initWishlist,mainController.add_cart)
route.route('/clear_cart').get(mainController.clear_cart)
route.route('/update_cart_plus').post(mainController.update_cart_plus)
route.route('/update_cart_minus').post(mainController.update_cart_minus)
route.route('/delete_item').post(mainController.delete_item)

route.route('/add_wishlist').post(mainController.add_wishlist)
route.route('/delete_from_wishlist').post(mainController.delete_from_wishlist)
route.route('/logout').get(mainController.logout);

route.post('/save_user', [
    [
        check('name').notEmpty().withMessage("Name is required"),
        check('email').notEmpty().withMessage("Email is required"),
        check('password').notEmpty().withMessage("Password is required"),
        check('cpassword').notEmpty().withMessage("Confirm Password is required").custom((value, {req}) => value === req.body.password).withMessage("The passwords do not match"),
        check('checkbox').notEmpty().withMessage("You have to accept term and condition"),
       
    ]
],
    async (req, resp) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped())
            const emptUser = req.session.user = [];
            resp.render('login', {errors : errors.mapped(),cart : req.session.cart, wishlist : req.session.wishlist,user : emptUser});
        }else{
			const user = new User(req.body);
            
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(user.password, salt);

            user.save();
            
            req.session.user = user;

            resp.redirect('/');
            // resp.render('index', {cart : req.session.cart, wishlist : req.session.wishlist, user :req.session.user})
		}
})

route.post('/check_login',[
    [
        check('email').notEmpty().withMessage("Email is required"),
        check('password').notEmpty().withMessage("Password is required"),
    ]
], async (req, resp) => {
    const errors = validationResult(req);
    const emptUser = req.session.user = [];
    if(!errors.isEmpty()){
        
        resp.render('login', {errors : errors.mapped(),cart : req.session.cart, wishlist : req.session.wishlist,user : emptUser});
    }else{
        const {email, password} = req.body;
        
        const user = await User.findOne({email}).select('+password')
        console.log(user)
        if(user !== null){
            const auth = await bcrypt.compare(password , user.password)
            if(!auth){
                req.flash('fail', 'Incorrect Username and Password');
                resp.locals.message = req.flash();
                // resp.send("not null");
                resp.render('login', {errors : errors.mapped(),cart : req.session.cart, wishlist : req.session.wishlist,user : emptUser});
            }else{
                req.session.user = user;
                resp.redirect('/');
                // resp.send("null");
                // resp.render('index', {cart : req.session.cart, wishlist : req.session.wishlist, user : req.session.user})
            }
            
        }else{
            req.flash('fail', 'Email not found in database');
                resp.locals.message = req.flash();
                // resp.send("not null");
                resp.render('login', {errors : [],cart : req.session.cart, wishlist : req.session.wishlist,user : emptUser});
        }
    }
})

route.route('/createOrder').post(mainController.createOrder)

route.route('/send_email').post(mainController.send_email)
// route.post('/createOrder', mainController.createOrder)

module.exports = route;