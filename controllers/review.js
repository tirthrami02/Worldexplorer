const Property = require('../models/property');
const Review = require('../models/review');

module.exports.addReview = async (req,res) =>{
    const {id} = req.params;
    const house = await Property.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    house.reviews.push(review);
    await review.save();
    await house.save();
    req.flash('success', 'Successfully Created new review !!');
    res.redirect(`/properties/${house._id}`);
}

module.exports.deleteReview = async (req,res) =>{
    const {id,reviewId } = req.params;
    await Property.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted the review !!');
    res.redirect(`/properties/${id}`);
}