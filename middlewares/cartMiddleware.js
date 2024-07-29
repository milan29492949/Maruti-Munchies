var session = require('express-session')

exports.initCart = (req, resp, next) => {
    if(!req.session.cart){
		req.session.cart = [];
	}
    next()
}
exports.initWishlist = (req, resp ,next) => {
    if(!req.session.wishlist){
        req.session.wishlist = [];
    }
    next()
}

exports.isLoggedIn = (req, resp , next) => {
    if(!req.session.user){
        req.session.user = [];
    }
    next();
}

