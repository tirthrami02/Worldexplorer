const express = require('express');
const router = express.Router({mergeParams : true});
const reviews = require('../controllers/review');
const catchAsync = require('../utils/catchasync');
const { isLoggedIn , isReviewAuthor ,validateReview} = require('../middleware');

router.post('/' , isLoggedIn ,validateReview, catchAsync( reviews.addReview));

router.delete('/:reviewId',  isLoggedIn ,isReviewAuthor ,catchAsync(reviews.deleteReview));
 
module.exports = router;