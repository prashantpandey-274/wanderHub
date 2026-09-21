const express =  require("express");

const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js");
const {reviewSchema} =require("../schema.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")


//-------------------------------------------------------
// function for servers side validation of reviews
//----------------------------------------------------------
// const validateReview = (req,res,next)=>{
//      let {error} =   reviewSchema.validate(req.body);
//    if(error){
//     let errMsg = error.details.map((el)=>el.message).join(",");
//      throw new ExpressError(400,error);
//     }else{
//         next();
//     }
// } // shifting it to middleware.js for better code


// copying reviews route fromapp.js
//----------------------------------------------------------------
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.saveReview))

//------------------------------------------------------------
//creating route to delete a review
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview))




module.exports = router;
