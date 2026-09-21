const Joi =require('joi');

//-------------------------------------------------
// creating schema for server side validation for different collections
//--------------------------------------------------
// for listings
//----------------------------------------------------
module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow(" ",null)
        
    }).required()
});

// --------------------------------------
// for reviews
//----------------------------------------

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment:Joi.string() .pattern(/[a-zA-Z]/).required()
    }).required()
})   