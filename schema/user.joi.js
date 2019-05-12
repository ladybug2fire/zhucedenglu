const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
    UserName: Joi.string().alphanum().min(3).max(30).required(),
    Password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    TelPhone: Joi.string().regex(/^1[34578]\d{9}$/),
    UserType: Joi.string().regex(/^[0|1]$/),
    code: Joi.string()
})
module.exports = schema;