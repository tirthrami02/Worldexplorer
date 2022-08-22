const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Place = require('../models/place');
const places = require('../controllers/places');

const {reviewSchema, placeSchema} = require('../schemas');
const { findById } = require('../models/place');
const {isLoggedIn} = require('../middleware');
const place = require('../models/place');
const validateplace = (req,res,next) => {
   
    const {error}  = placeSchema.validate(req.body);
    console.log(error);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}



router.get('/',catchAsync(places.index));

router.get('/new', places.renderNewForm);

router.post('/',validateplace, catchAsync(places.createPlace))

router.get('/:id',catchAsync(places.showPlace));

router.get('/:id/edit',catchAsync(places.renderEditForm));

router.put('/:id', validateplace, catchAsync(places.updatePlace))

router.delete('/:id', catchAsync(places.deletePlace));

module.exports = router;