const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле email обязательное'],
    unique: [true, 'Указанный email уже существует'],
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введите корректный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле password обязательное'],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина name - 2'],
    maxlength: [30, 'Максимальная длина name - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина about - 2'],
    maxlength: [30, 'Максимальная длина about - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (link) => /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(link),
      message: 'Введите корректную ссылку',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
