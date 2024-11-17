const joi = require("joi");

// Difference between joi schema validation and moongoose schema validation
/*
1. Joi supports large set of validation as compared to moongose schema validation
2. In joi ,  validation DB intereraction se pehle hi ho jaati hai whereas in moongoose validation wagera DB interaction ke doran hota hai . That is why moongoose mai extra DB overhead hai 
3. In joi agar validation 5 fields mai hai to 5 feilds hi honi chahiye extra fields dene pe validation fail ho jaayegi whereas moongoose validation mai extra feilds ignore hoti hai .
*/

const listingSchema = joi.object({
    Listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        location : joi.string().required(),
        country : joi.string().required(),
        price : joi.number().required().min(0),
        image : joi.string().allow("" , null),
    }).required(),
})

module.exports = listingSchema