
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers')

const mongoose = require('mongoose');
const Campground=require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp');


const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected")
});

const sample=(array)=> array[Math.floor(Math.random()*array.length)]


const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price= Math.floor(Math.random()*20)+10;
        const camp= new Campground({
            author: '62d2a4b0e8f6d1ddb615830d',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            
            description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam dignissimos, soluta deleniti accusamus velit quo ea quis et quibusdam aspernatur perspiciatis placeat minus debitis doloribus fugiat consequuntur necessitatibus eum distinctio?',
            price: price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dcccwdpas/image/upload/v1658143881/YelpCamp/ogdvyjhxafxf9kbqp8cw.jpg',
                  filename: 'YelpCamp/ogdvyjhxafxf9kbqp8cw',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dcccwdpas/image/upload/v1658143882/YelpCamp/p6ix8hcrrm4jilsn3ggy.jpg',
                  filename: 'YelpCamp/p6ix8hcrrm4jilsn3ggy',
                  
                }
              ]
        })
        await camp.save();
    }
}
 
seedDB().then(()=>{
    mongoose.connection.close()
})

