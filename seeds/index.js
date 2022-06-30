const mongoose = require('mongoose');
const Property = require('../models/property');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/prop-dot', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});
const db= mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random()*array.length)];
const seedDB = async () =>{
    await Property.deleteMany({});
    for(let i=0;i<50;i++){
        const rand1000= Math.floor(Math.random()*1000);
        const house =new Property({
            author : '62b576208d7760ad652c9965',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price : 12,
            description : 'nice place to visit!!',
            images: [
                {
                  url: 'https://res.cloudinary.com/djgm4oarl/image/upload/v1656167317/YelpCamp/m1348gkfkjvpjfxsctty.jpg',
                  filename: 'YelpCamp/m1348gkfkjvpjfxsctty',
                }
              ],
              geometry: {
                type: "Point",
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude,
                ]
            },
        })
        await house.save();
    }
}
seedDB().then(() => {
    db.close();
});