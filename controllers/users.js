const User = require('../models/user');

const defaultServerError = { message: 'На сервере произошла ошибка' };

// Создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send(defaultServerError);
    });
};

// Получение массива пользователей
const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send(defaultServerError));
};

// Получение данных пользователя по id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(400).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => res.status(500).send(defaultServerError));
};

// Изменение информации о пользователе
const editUserInfo = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
      .then((editedProfile) => res.status(200).send(editedProfile))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
          return;
        }
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      });
    return;
  }
  res.status(500).send(defaultServerError);
};

// Изменение аватара пользователя
const editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
      .then((editedProfile) => res.status(200).send(editedProfile))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
          return;
        }
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      });
    return;
  }
  res.status(500).send(defaultServerError);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  editUserInfo,
  editUserAvatar,
};
