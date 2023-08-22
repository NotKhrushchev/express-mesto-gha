const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUserById, editUserInfo, editUserAvatar, getMe,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    /* eslint-disable no-useless-escape */
    avatar: Joi.string().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/),
  }),
}), editUserAvatar);

module.exports = router;
