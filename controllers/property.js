const Property = require('../models/property');
const mpBoxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mpBoxGeoCoding({ accessToken: mapBoxToken });
const  {cloudinary } = require('../cloudinary');

module.exports.index= async (req,res)=>{
    const properties = await Property.find({});
    res.render('properties/index',{properties});
}

module.exports.NewForm = (req,res) =>{
    res.render('properties/new');
}

module.exports.createProperty = async (req,res) =>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.property.location,
        limit: 1
    }).send()
    const house =new Property(req.body.property);
    house.geometry = geoData.body.features[0].geometry;
    house.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    house.author = req.user._id;
    await house.save();
    req.flash('success' , 'successfully Added new Property !!');
    res.redirect(`/properties/${house._id}`);
}

module.exports.showProperty = async (req,res) =>{
    const {id } = req.params;
    const house = await Property.findById(id).populate({
        path  : 'reviews',
        populate : {
            path : 'author',
        }
    }).populate('author');
    if(!house){
        req.flash('error' , 'Cannot find the Property !!');
        return res.redirect(`/properties`);
    }
    res.render('properties/show' ,{house});
}

module.exports.EditForm = async (req,res) =>{
    const {id } = req.params;
    const house = await Property.findById(id);
    if(!house){
        req.flash('error' , 'Cannot find the Property !!');
        return res.redirect(`/properties`);
    }
    res.render('properties/edit' ,{house});
}

module.exports.updateProperty = async (req,res) =>{
    const {id} = req.params;
    const house = await Property.findByIdAndUpdate(id, {...req.body.property});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    house.images.push(...imgs);
    await house.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await house.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success' , 'successfully updated  Property !!');
    res.redirect(`/properties/${house._id}`);
}

module.exports.deleteProperty = async (req,res) =>{
    const {id} = req.params;
    const house = await Property.findByIdAndDelete(id);
    req.flash('success' , 'Successfully deleted Property !!');
    res.redirect(`/properties`);
}