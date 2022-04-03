import Joi from "joi";


const schemas = {
    signUp: Joi.object().keys({
        firstName: Joi.string().min(3).max(15).required(),
        lastName: Joi.string().min(3).max(15).required(),
        dateOfBirth: Joi.date().raw().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        password: Joi.string().min(6).required(),
        gender: Joi.number().min(0).max(2).required(),
    }), 
    signIn: Joi.object().keys({
        key : Joi.string().required(),
        password : Joi.string().required(),
    }), 
    verify: Joi.object().keys({
        code : Joi.string().length(5).pattern(/^[0-9]+$/).required()
    })
}

export default schemas