const Card = require('../models/card');
const defaultServerError = { message: 'На сервере произошла ошибка' };

// Создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id})
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
    .catch(() => {
      res.status(500).send(defaultServerError);
    });
};

module.exports = {
  createCard,
  getAllCards
}