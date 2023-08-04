const Card = require('../models/card');
const defaultServerError = { message: 'На сервере произошла ошибка' };

// Создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id})
    .then(card => res.status(201).send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      };
      res.status(500).send(defaultServerError)
    });
}

const getAllCards = (req, res) => {
  Card.find({})
    .then(users => res.status(200).send(users))
    .catch(() => res.status(500).send(defaultServerError));
};

const removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.status(200))
    .catch(() => res.status(404).send({ message: 'Карточка с указанным id не найдена'}));
};

module.exports = {
  createCard,
  getAllCards,
  removeCard
}