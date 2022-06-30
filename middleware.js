const expressError = require('./utils/expressError');
const{ propertySchema , reviewSchema}= require('./Schema.js');
const Property = require('./models/property');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        //req.session.returnTo = req.originalUrl
        req.flash('error' , 'You must be signned in first !!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateProperty = (req,res,next) =>{
    const {error} = propertySchema.validate(req.body);
    if(error) {
        const msg= error.details.map( el => el.message).join(',')
        throw new expressError(msg,400);
    }else{
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const house = await Property.findById(id);
    if (!house.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission !');
        return res.redirect(`/properties/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg= error.details.map( el => el.message).join(',')
        throw new expressError(msg,400);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission !');
        return res.redirect(`/properties/${id}`);
    }
    next();
}

