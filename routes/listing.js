// implementing router to organise lisitings schema paths and midleware
const express = require("express");
const app = express();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} =require("../schema.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer = require("multer")
const {storage} =require("../cloudConfig.js")
const upload = multer({storage});
//--------------------------------------------------------------
//creating router object
//---------------------------------------------------
const router = express.Router();

//----------------------------------------------------------
// method to validate listings
//-------------------------------------------------------
// validating listings entries into database
// const validateListing = (req,res,next)=>{
//     let {error} =   listingSchema.validate(req.body);
//    if(error){
//     let errMsg = error.details.map((el)=>el.message).join(",");
//      throw new ExpressError(400,error);
//     }else{
//         next();
//     }
// }; // shifting this as a middleware to improve code structure


//---------------------------------------------------
// getting all listings method from app.js
//-------------------------------------------------------

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,upload.single('listing[image]'), wrapAsync(listingController.saveNewForm));


router.get("/new",isLoggedIn ,listingController.renderNewForm);
// creating a get route to render a form 
// creating a post route to add the form detail to database

router.route("/:id")
.get( wrapAsync (listingController.viewAListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateEditedListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// creating route to get all the listing data
// router.get("/", wrapAsync(listingController.index));
//-------------------------------------------------------------------
// creating a route to add new location



// router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.saveNewForm));
//---------------------------------------------------------------
// creating show route to view detail of specific listing

// router.get("/:id",  wrapAsync (listingController.viewAListing));
//---------------------------------------------------------------------
//creating a route to update a particular location information
// get route to render edit form 
router.get("/:id/edit",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.renderEditForm));

// creating a put route to update the changes at database
// router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.updateEditedListing));
//---------------------------------------------------------------------
// creating a route to delete a entry
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports = router;