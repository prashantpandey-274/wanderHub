if(process.env.NODE_ENV!="production"){
      require('dotenv').config();
}



const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} =require("./schema.js");
const Review = require("./models/review.js");
const {reviewSchema} =require("./schema.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session") ;
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");

const dbURL = process.env.ATLASDB_URL;
//--------------------------------------------------------
// implementing mongo-connect as session storage
//------------------------------------------------------

const store = MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600 ,
 });
 store.on("error",(error)=>{
    console.log("error in mongo session store");
    console.log(error);
 })


//---------------------------------------------------
// implementing express sessions
//---------------------------------------------------

 const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
 };

  
 

//------------------------------------------------
// setting up middleware
//-------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
//---------------------------------------------------------------
//setting up database connection
//---------------------------------------------------------------





async function main() {
    await mongoose.connect(dbURL);

}

main().then((res) => {
    console.log("connection successfull with database!");

}).catch((err) => {
    console.log(err);
});
//---------------------------------------------------
// implementing sessions in node
//------------------------------------------------------

app.use(session(sessionOptions));

//------------------------------------------------
// using flash to send a msg when a post is added
//------------------------------------------------
app.use(flash());
//================================================================================
// implementing authentication using passport
//================================================================================
//-----------------------------------------------
// initializing passport for every request
//----------------------------------------------
app.use(passport.initialize());
// implementing passport  session so webapp can identfy user
// as they brwse from page to page
 app.use(passport.session());

 // using passport features to authenticate user
 passport.use(new LocalStrategy(User.authenticate()))
 // serialize :- storing use info into session
 // deserialize:- after session is expired  remove info from session
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
//-----------------------------------------------
// creating middleware to define res.local variables
//-----------------------------------------------
app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;

   next();
})
//---------------------------------------------------------
//  user routes
//--------------------------------------------------------------
// // creating demo route to add user
// //=============================================
// app.get("/demoUser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"ssipmt Student"
//     });
//    let registeredUser =  await User.register(fakeUser,"helloWorld!");
//    res.send(registeredUser);

// })
// //=============================================
//--------------------------------------------------------
//-------------------------------------------------------
app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter);

//-------------------------------------------------------------
// creating function for server side validation
//--------------------------------------------------------------------

// const validateListing = (req,res,next)=>{
//     let {error} =   listingSchema.validate(req.body);
//    if(error){
//     let errMsg = error.details.map((el)=>el.message).join(",");
//      throw new ExpressError(400,error);
//     }else{
//         next();
//     }
// };

// function to validate reviews in server
// const validateReview = (req,res,next)=>{
//      let {error} =   reviewSchema.validate(req.body);
//    if(error){
//     let errMsg = error.details.map((el)=>el.message).join(",");
//      throw new ExpressError(400,error);
//     }else{
//         next();
//     }
// }


// app.use("/listings",listings);


//-------------------------------------------------------------------
// setting up routes
//-------------------------------------------------------------------
//------------------------------------------------------------------------
// get route for home page
// app.get("/", (req, res) => {
//     res.render("listings/home.ejs");
// })
// //-------------------------------------------------------------
// testing route
// app.get("/testListing",async(req,res)=>{
//     let sampleListing  = new Listing({
//         title:"My own villa",
//         description:"by the goa beach",
//         price:"1200",
//         location:"calanguate , Goa",
//         country:"India"
//     })
//     await sampleListing.save().then((res)=>{
//         console.log("sample was saved!")
//     }).catch((err)=>{
//         console.log(err);
//     })
//     res.send("successfull testing !!");
// });
//---------------------------------------------------------------------------
//---------------------------------------------------
// // creating route to get all the listing data
// app.get("/listings", wrapAsync(async (req, res) => {
//     let allListings = await Listing.find();
//     res.render("listings/index.ejs", { allListings });
// }));
// //-------------------------------------------------------------------
// // creating a route to add new location

// // creating a get route to render a form 
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
// })
// // creating a post route to add the form detail to database

// app.post("/listings",validateListing, wrapAsync(async (req, res,next) => {
//   const newListing = new Listing(req.body.listing);
//   await newListing.save()
//   res.redirect("/listings");


// }))
// //---------------------------------------------------------------
// // creating show route to view detail of specific listing

// app.get("/listings/:id",  wrapAsync (async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listing });
// }))
// //---------------------------------------------------------------------
// //creating a route to update a particular location information
// app.get("/listings/:id/edit",validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// }))

// // creating a put route to update the changes at database
// app.put("/listings/:id",wrapAsync( async (req, res) => {
//     let { id } = req.params;
//     let newlisting = req.body.listing;

//     newlisting.image = {
//         url: newlisting.image
//     };
//     // udating databse based on the form input
//     await Listing.findByIdAndUpdate(id, newlisting, { returnDocument: "after" })
//         .then((res) => {
//             console.log(res);
//         }).catch((err) => {
//             console.log(err);
//         })
//     res.redirect("/listings");
// }))
// //---------------------------------------------------------------------
// // creating a route to delete a entry
// app.delete("/listings/:id", wrapAsync(async(req, res) => {
//     let { id } = req.params;
//    await Listing.findByIdAndDelete(id).then((res) => {
//         console.log(res);
//     }).catch((err) => {
//         console.log(err);
//     })
//     res.redirect("/listings");

// }));
//-----------------------------------------------------------------------------------
// // creating route for review features
// //------------------------------------------------------------------------------------------------
// // creating a route to add review to listings
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new Review(req.body.review);
//    listing.reviews.push(newReview);  

//    await newReview.save()
//    await listing.save()

//    console.log("new reviewd saved")
//    res.redirect(`/listings/${listing._id}`);
// }))

// //------------------------------------------------------------
// //creating route to delete a review
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
//    let {id,reviewId} = req.params;
//    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//    await Review.findByIdAndDelete(reviewId);

//    res.redirect(`/listings/${id}`);
// }))


//----------------------------------------------------------------------------------
// standard response if sombody search for undefined route
app.all("*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
})
//--------------------------------------------------------------
//defining middleware to handel server side error
app.use((err, req, res, next) => {
    let {status=500,message="undefined error"} = err;
     res.status(status).render("error.ejs",{err});
})


app.listen(port, () => {
    console.log(`app is listening at :${port}`);
})
