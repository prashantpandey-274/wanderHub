const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =  process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




module.exports.index =  async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    // checking if user is authenticated before creating a new entry
   
    res.render("listings/new.ejs");
    
}

module.exports.saveNewForm =async (req, res,next) => {

let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
}).send();


    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,filename);
  const newListing = new Listing(req.body.listing);
    

 

   newListing.owner = req.user._id;
   newListing.geometry = response.body.features[0].geometry;
  let savedListing =  await newListing.save();
  console.log(savedListing);
  req.flash("success","new location added succesfully");
  res.redirect("/listings");


}

module.exports.viewAListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
    if (!listing){
          req.flash("error","listing you requested doesn't exsist");
          res.redirect("/listings");
    }else{
        console.log(listing);
         res.render("listings/show.ejs", { listing ,mapToken: process.env.MAP_TOKEN});
    }
   
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
 if (!listing){
          req.flash("error","listing you requested doesn't exsist");
          res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}
module.exports.updateEditedListing = async (req, res) => {
    let { id } = req.params;

    let newlisting = req.body.listing;
         
    
    // udating databse based on the form input
   

    let listing = await Listing.findByIdAndUpdate(id, newlisting, { returnDocument: "after" })
        .then((res) => {
            console.log(res);
            return res;
        }).catch((err) => {
            console.log(err);
        })
        if(typeof req.file!=="undefined"){
              let url = req.file.path;
              let filename = req.file.filename;

        listing.image = {
        url: url,
        filename: filename
    };
    await listing.save();}


         req.flash("success","listing updated");
    res.redirect("/listings");
}
module.exports.destroyListing = async(req, res) => {
    let { id } = req.params;
   await Listing.findByIdAndDelete(id).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
     req.flash("success","listing deleted");
    res.redirect("/listings");

}
