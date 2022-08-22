const mongoose = require('mongoose');
const cities = require('./cities');

const {places, descriptors} = require('./seedHelpers');

const Place = require('../models/place')
mongoose.connect('mongodb://localhost:27017/worldex', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    
    await Place.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 10;
        const pla = new Place({
            author: '6300c0f3e69f08c2ac7dde7f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'When Tony Stark, an industrialist, is captured, he constructs a high-tech armoured suit to escape. Once he manages to escape, he decides to use his suit to fight against evil forces to save the world.',
            price
        });        
        await pla.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})