 const Listing = require("./models/listing")
 const ExpressError = require("./utils/ExpressError.js")
 const {listingSchema,reviewSchema} = require("./schema.js")
const Review = require("./models/review.js");
 
 
 
 module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","login to add details!");
       return res.redirect("/login")
    }
    next();
  }         

  // now here is an issue whenever passport method execute succesfully it clears any variable is sessions
  // so our redirectUrl will be cleared
// so in ordert to save it we need to add it to the locals

// for that we will create a middleware

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
     res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// creating a middleware to verify listings

module.exports.isOwner = async(req,res,next)=>{
       let {id} = req.params;
      let listing = await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)){
           req.flash("error","you are not the owner !")
           return res.redirect(`/listings/${id}`)
        }
        next();
}

// middleware to verify listings
 module.exports.validateListing = (req,res,next)=>{
    let {error} =   listingSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,error);
    }else{
        next();
    }
};
// method to validate review 
 module.exports.validateReview = (req,res,next)=>{
     let {error} = reviewSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,error);
    }else{
        next();
    }
  };
  // method to verify author before deleting a reveis

module.exports.isAuthor = async (req,res,next)=>{
         let {id,reviewId} = req.params;
      let review = await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id)){
           req.flash("error","you are not the author  !")
           return res.redirect(`/listings/${id}`)
        }
        next();
}