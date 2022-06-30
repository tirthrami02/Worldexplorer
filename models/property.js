const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const options = { toJSON: { virtuals: true } };
const PropertySchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},options)

PropertySchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/properties/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

// this  middleware will run ony when the  delete one function is called ,not on deletemany
PropertySchema.post('findOneAndDelete' , async function(doc){
    if(doc){
        await review.deleteMany({
            $in : doc.reviews
        })
    }
})
module.exports = mongoose.model('Property',PropertySchema);
