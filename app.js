const express = require('express');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const { errors, celebrate, Joi } = require('celebrate');

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

const port = process.env.PORT || '3000';
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/mestodb';

const routes = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { NotFoundErr } = require('./errors');

const app = express();

mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(express.json());

// Роут аутентификации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string.required().unique().email(),
    password: Joi.string().required(),
  }),
}), login);

// Роут регистрации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string.required().unique().email(),
    password: Joi.string().required(),
    name: Joi.string.min(2).max(30),
    about: Joi.string.min(2).max(200),
    avatar: Joi.string.pattern(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g),
  }),
}), createUser);

app.use(auth);

app.use('/users', routes.userRoute);
app.use('/cards', routes.cardRoute);
app.use('*', (req, res) => {
  throw new NotFoundErr('Страница не найдена');
});

app.use(errors());

// Глобальный мидлвэр для обработки ошибок
app.use((err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({ message: statusCode === INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(port);
