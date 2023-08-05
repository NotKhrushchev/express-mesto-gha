const { StatusCodes } = require('http-status-codes');

const {
  CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK,
} = StatusCodes;
const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const defaultServerError = { message: 'На сервере произошла ошибка' };

// Создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.ValidationError:
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
          break;
        default:
          res.status(INTERNAL_SERVER_ERROR).send(defaultServerError);
          break;
      }
    });
};

// Получение массива пользователей
const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send(defaultServerError));
};

// Получение данных пользователя по id
const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.CastError:
          res.status(BAD_REQUEST).send({ message: 'Передан невалидный id пользователя' });
          break;
        case mongoose.Error.DocumentNotFoundError:
          res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
          break;
        default:
          res.status(INTERNAL_SERVER_ERROR).send(defaultServerError);
          break;
      }
    });
};

// Изменение информации о пользователе
const editUserInfo = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((editedProfile) => res.status(OK).send(editedProfile))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.ValidationError:
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
          break;
        case mongoose.Error.CastError:
          res.status(BAD_REQUEST).send({ message: 'Передан невалидный id пользователя' });
          break;
        case mongoose.Error.DocumentNotFoundError:
          res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
          break;
        default:
          res.status(INTERNAL_SERVER_ERROR).send(defaultServerError);
          break;
      }
    });
};

// Изменение аватара пользователя
const editUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    _id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((editedProfile) => res.status(OK).send(editedProfile))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.ValidationError:
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
          break;
        case mongoose.Error.DocumentNotFoundError:
          res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
          break;
        default:
          res.status(INTERNAL_SERVER_ERROR).send(defaultServerError);
          break;
      }
    });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  editUserInfo,
  editUserAvatar,
};
