const mongoose = require('mongoose');
const { IMG_REGEX } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина name - 2'],
    maxlength: [30, 'Максимальная длина name - 30'],
    required: [true, 'Поле name обязательное'],
  },
  link: {
    type: String,
    required: [true, 'Поле link обязательное'],
    validate: {
      /* eslint-disable no-useless-escape */
      validator: (link) => IMG_REGEX.test(link),
      message: 'Введите корректную ссылку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
