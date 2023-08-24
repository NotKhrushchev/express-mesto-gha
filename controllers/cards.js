const { CREATED, OK } = require('http-status-codes').StatusCodes;

const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const { BadRequestErr, AccessErr, NotFoundErr } = require('../errors/index');

// Создание карточки
const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.ValidationError:
          next(new BadRequestErr('Переданы некорректные данные при создании карточки'));
          break;
        default:
          next(err);
          break;
      }
    });
};

// Получение массива карточек
const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
};

// Удаление карточки
const removeCard = (req, res, next) => {
  const { cardId } = req.params;
  // Перед удалением проверяю на соответствие id пользователя и создателя карточки
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new AccessErr();
      }
      Card.deleteOne({ _id: cardId })
        .orFail()
        .then(() => res.status(OK).send({ message: 'Карточка успешно удалена' }))
        .catch(next);
    })
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.CastError:
          next(new BadRequestErr('Передан невалидный id карточки'));
          break;
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundErr('Карточка по указанному id не найдена'));
          break;
        default:
          next(err);
          break;
      }
    });
};

// Лайк карточки
const likeCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail()
    .then((likedCard) => res.status(OK).send(likedCard))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundErr('Карточка по указанному id не найдена'));
          break;
        case mongoose.Error.CastError:
          next(new BadRequestErr('Передан невалидный id карточки'));
          break;
        default:
          next(err);
          break;
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail()
    .then((dislikedCard) => res.status(OK).send(dislikedCard))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundErr('Карточка по указанному id не найдена'));
          break;
        case mongoose.Error.CastError:
          next(new BadRequestErr('Передан невалидный id карточки'));
          break;
        default:
          next(err);
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
