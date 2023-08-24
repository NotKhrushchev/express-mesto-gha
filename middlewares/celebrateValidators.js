const { celebrate, Joi } = require('celebrate');
const { URL_REGEX } = require('../utils/constants');

const signupCelebrate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    /* eslint-disable no-useless-escape */
    avatar: Joi.string().pattern(URL_REGEX),
  }),
});

const signinCelebrate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  signupCelebrate,
  signinCelebrate,
};
