const Card = require('../models/card');

const defaultServerError = { message: 'На сервере произошла ошибка' };

// Создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send(defaultServerError);
    });
};

// Получение массива карточек
const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send(defaultServerError));
};

// Удаление карточки
const removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send(card);
        return;
      }
      res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки' }));
};

// Лайк карточки
const likeCard = (req, res) => {
  const isIdValid = req.params.cardId.length === 24;
  if (isIdValid) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    )
      .then((likedCard) => {
        if (likedCard) {
          res.status(200).send(likedCard);
          return;
        }
        res.status(404).send({ message: 'Передан несуществующий id карточки' });
      })
      .catch(() => res.status(500).send(defaultServerError));
    return;
  }
  res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
};

const dislikeCard = (req, res) => {
  const isIdValid = req.params.cardId.length === 24;
  if (isIdValid) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    )
      .then((dislikedCard) => {
        if (dislikedCard) {
          res.status(200).send(dislikedCard);
          return;
        }
        res.status(404).send({ message: 'Передан несуществующий id карточки' });
      })
      .catch(() => res.status(500).send(defaultServerError));
    return;
  }
  res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
};

module.exports = {
  createCard,
  getAllCards,
  removeCard,
  likeCard,
  dislikeCard,
};
