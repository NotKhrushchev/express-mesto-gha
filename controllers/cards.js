const { StatusCodes } = require('http-status-codes');

const {
  CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK,
} = StatusCodes;
const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const defaultServerError = { message: 'На сервере произошла ошибка' };

// Создание карточки
const createCard = (req, res) => {
  const { userId } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.ValidationError:
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
          break;
        default:
          res.status(INTERNAL_SERVER_ERROR).send(defaultServerError);
          break;
      }
    });
};

// Получение массива карточек
const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send(defaultServerError));
};

// Удаление карточки
const removeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.DocumentNotFoundError:
          res.status(NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
          break;
        case mongoose.Error.CastError:
          res.status(BAD_REQUEST).send({ message: 'Передан невалидный id карточки' });
          break;
        default:
          res.status(INTERNAL_SERVER_ERROR).send(defaultServerError);
          break;
      }
    });
};

// Лайк карточки
const likeCard = (req, res) => {
  const { userId } = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((likedCard) => res.status(OK).send(likedCard))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.DocumentNotFoundError:
          res.status(NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
          break;
        case mongoose.Error.CastError:
          res.status(BAD_REQUEST).send({ message: 'Передан невалидный id карточки' });
          break;
        default:
          res.status(INTERNAL_SERVER_ERROR).send(defaultServerError);
          break;
      }
    });
};

const dislikeCard = (req, res) => {
  const { userId } = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((dislikedCard) => res.status(OK).send(dislikedCard))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.DocumentNotFoundError:
          res.status(NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
          break;
        case mongoose.Error.CastError:
          res.status(BAD_REQUEST).send({ message: 'Передан невалидный id карточки' });
          break;
        default:
          res.status(INTERNAL_SERVER_ERROR).send(defaultServerError);
          break;
      }
    });
};

module.exports = {
  createCard,
  getAllCards,
  removeCard,
  likeCard,
  dislikeCard,
};
