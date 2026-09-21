const mongoose =require("mongoose");
const Schema  = mongoose.Schema;
const Review = require("./review.js")


const listingSchema = new Schema({
    title:{type:String,required:true},
    description: String,
    image:{
        filename:{ type:String,},
        url:{type:String,
        default:"https://digital.ihg.com/is/image/ihg/wasct",
        set:(v)=> v===" "?"https://digital.ihg.com/is/image/ihg/wasct":v,
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",

    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
});

// creating mongoose middleware to handel deletion of reviews when a post is deleted

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})




const Listing = mongoose.model("Listing",listingSchema);



module.exports = Listing;