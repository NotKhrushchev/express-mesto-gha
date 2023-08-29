const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUserById, editUserInfo, editUserAvatar, getMe,
} = require('../controllers/users');
const { IMG_REGEX } = require('../utils/constants');

router.get('/', getAllUsers);
router.get('/me', getMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
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
    avatar: Joi.string().pattern(IMG_REGEX),
  }),
}), editUserAvatar);

module.exports = router;
