const User = require('../models/user');

// Создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(201).send(user))
    .catch(() => {
      res.status(500).send(`На сервере произошла ошибка`)
    });
};

const getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch(() => {
      res.status(500).send(`На сервере произошла ошибка`)
    });
}

module.exports = {
  createUser,
  getAllUsers
}