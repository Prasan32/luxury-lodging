import Joi from "joi";

export const getAvailableListingsSchema = Joi.object({
    location: Joi.string().required().allow(""),
    checkIn: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required().allow(""),
    checkOut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required().allow(""),
    guests: Joi.number().required().min(1).max(50).allow(""),
}).custom((value, helpers) => {
    if (value.checkIn !== "" && value.checkOut === "") {
        return helpers.message({ custom: '"checkOut" must not be empty when "checkIn" is provided' });
    }
    return value;
});
