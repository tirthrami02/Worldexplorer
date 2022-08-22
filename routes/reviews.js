const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Place = require('../models/place');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas');
const { findById } = require('../models/place');
const reviews = require('../controllers/reviews');

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    console.log(error)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

router.post('/', validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', catchAsync(reviews.deleteReviews));

module.exports = router;
