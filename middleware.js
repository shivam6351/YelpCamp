const session  = require('express-session')


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','you must be signed in ')
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo);
        return res.redirect('/login');
    }
    next();
}

