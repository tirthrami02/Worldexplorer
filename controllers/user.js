const User = require('../models/user');

module.exports.registerForm = (req,res) =>{
    res.render('users/register');
}

module.exports.register = async (req,res) =>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user,password) ; 
    req.login(registeredUser, e => {
        if (e) return next(e);
        req.flash('success' ,`Heyy ${username} !! Welcome to PropDot`);
        res.redirect('/properties');
    })
    } catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req,res) =>{
    req.flash('success' , ` Welcome Back ${req.body.username} !!`) ;
    // const redirectUrl = req.session.returnTo || '/properties';
    //delete req.session.returnTo;
    res.redirect('/properties');
}

module.exports.logout = (req, res,next) => {
    req.logout( (err) => {
        if (err) { return next(err); }
        req.flash('success', "Successfully Logged Out !!");
        res.redirect('/properties');
      });
}