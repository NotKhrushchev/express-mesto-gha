const { CREATED, OK } = require('http-status-codes').StatusCodes;
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const {
  DuplicateEmailErr, AuthorizationErr, BadRequestErr, NotFoundErr,
} = require('../errors/index');

// Создание пользователя
const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      const theUser = user;
      theUser.password = undefined;
      res.status(CREATED).send(theUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DuplicateEmailErr());
        return;
      }
      switch (err.constructor) {
        case mongoose.Error.ValidationError:
          next(new BadRequestErr(err.message.split(':')[2]));
          break;
        default:
          next(err);
          break;
      }
    });
};

// Получение массива пользователей
const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

// Получение данных пользователя по id
const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.CastError:
          next(new BadRequestErr('Передан невалидный id пользователя'));
          break;
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundErr('Пользователь по указанному id не найден'));
          break;
        default:
          next(err);
          break;
      }
    });
};

// Изменение информации о пользователе
const editUserInfo = (req, res, next) => {
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
          next(new BadRequestErr('Переданы некорректные данные при обновлении пользователя'));
          break;
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundErr('Пользователь по указанному id не найден'));
          break;
        default:
          next(err);
          break;
      }
    });
};

// Изменение аватара пользователя
const editUserAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    _id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((editedProfile) => res.status(OK).send(editedProfile))
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.ValidationError:
          next(new BadRequestErr('Переданы некорректные данные при обновлении пользователя'));
          break;
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundErr('Пользователь по указанному id не найден'));
          break;
        default:
          next(err);
          break;
      }
    });
};

// Аутентификация
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationErr();
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationErr();
          }
          const token = jwt.sign({ _id: user._id }, 'key', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(next);
};

// Получение данных авторизованного пользователя
const getMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => res.status(OK).send(user))
    .catch(next);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  editUserInfo,
  editUserAvatar,
  login,
  getMe,
};
