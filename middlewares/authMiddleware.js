var session = require('express-session')
var flash = require('connect-flash');

exports.isAuth = (req, resp, next) => {
    req.flash('fail', 'You have to login first');
    resp.locals.message = req.flash();
    if(req.session.user.length === 0){
        resp.redirect('/login');
    }else{
        next();
    }
    
}