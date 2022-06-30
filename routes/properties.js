const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage})
const catchAsync = require('../utils/catchasync');
const properties = require('../controllers/property');
const { isLoggedIn , isAuthor, validateProperty} = require('../middleware');


router.route('/')
    .get(catchAsync(properties.index))
    .post(isLoggedIn, upload.array('image'), validateProperty, catchAsync(properties.createProperty));

router.get('/new', isLoggedIn , properties.NewForm)

router.route('/:id')
    .get(catchAsync(properties.showProperty))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateProperty, catchAsync(properties.updateProperty))
    .delete(isLoggedIn, isAuthor, catchAsync(properties.deleteProperty));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(properties.EditForm))

module.exports = router;