const router = require('express').Router();
const { createCard, getAllCards, removeCard } = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getAllCards);
router.delete('/:cardId', removeCard)

module.exports = router;