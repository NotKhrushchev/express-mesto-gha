const router = require('express').Router();
const { createCard, getAllCards, removeCard, likeCard } = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getAllCards);
router.delete('/:cardId', removeCard);
router.put('/:cardId/likes', likeCard);

module.exports = router;