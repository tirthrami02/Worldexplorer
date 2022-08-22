const Place = require('../models/place');

module.exports.index = async (req,res)=> {
    const places = await Place.find({});
    res.render('places/index',{ places });
}

module.exports.renderNewForm = (req,res) => {
    res.render('places/new');
}

module.exports.createPlace = async(req,res, next) => {
    
    const place = new Place(req.body.place);
    await place.save();
    req.flash('success', 'Successfully made a new place!');
    res.redirect(`/places/${place._id}`)
}

module.exports.showPlace = async(req,res) => {

    const place = await Place.findById(req.params.id).populate('reviews');
    console.log(place);
    if(!place){
        req.flash('error', 'Cannot find that place!');
        return res.redirect('/places');
    }
    res.render('places/show', { place });
}

module.exports.renderEditForm = async (req,res) => {

    const place = await Place.findById(req.params.id);
    if(!place){
        req.flash('error', 'Cannot find that place!');
        return res.redirect('/places');
    }
    res.render('places/edit', { place });
}

module.exports.updatePlace = async(req,res) => {

    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, { ...req.body.place},{new: true});
    await place.save();
    req.flash('success','Successfully updated place');
    res.redirect(`/places/${place._id}`)
}

module.exports.deletePlace = async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect('/places');
}