const router = require('express').Router();
const { createCard, getAllCards } = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getAllCards);

module.exports = router;