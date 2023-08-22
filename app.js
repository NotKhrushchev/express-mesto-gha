const express = require('express');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');

const { NOT_FOUND } = StatusCodes;

const port = process.env.PORT || '3000';
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/mestodb';

const routes = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const app = express();

mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', routes.userRoute);
app.use('/cards', routes.cardRoute);
app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(port);
