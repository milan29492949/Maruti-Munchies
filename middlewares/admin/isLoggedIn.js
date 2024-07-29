var session = require('express-session')
var flash = require('connect-flash');

exports.isLoggedIn = (req, resp , next) => {
    if(!req.session.admin){
        req.session.admin = [];
    }
    if(req.session.admin.length === 0){
        req.flash('fail', 'You have to login First');
        resp.locals.message = req.flash();
        resp.render('admin/login', {errors : []});
    }else{
        next();
    }
    // next();
    
    
    
}