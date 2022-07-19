const mongoose = require('mongoose');
const Review = require('./review');


//https://res.cloudinary.com/dcccwdpas/image/upload/v1658213378/YelpCamp/ct0xvtv3625ucabrebsp.jpg


const Schema=mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const CampgroundSchema= new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author :{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('Campground',CampgroundSchema);