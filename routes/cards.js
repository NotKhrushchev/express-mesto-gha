const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getAllCards, removeCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().pattern(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), removeCard);

router.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
