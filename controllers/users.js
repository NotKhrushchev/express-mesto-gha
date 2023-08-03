const User = require('../models/user');
const defaultServerError = `На сервере произошла ошибка`;

// Создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(201).send(user))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные при создании пользователя');
        return;
      };
      res.status(500).send(defaultServerError)
    });
};

const getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch(() => {
      res.status(500).send(defaultServerError);
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        res.status(404).send('Пользователь по указанному id не найден');
        return;
      };
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(500).send(defaultServerError);
    });
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById
}