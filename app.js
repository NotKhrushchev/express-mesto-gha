const express = require('express');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');

const { NOT_FOUND } = StatusCodes;

const port = process.env.PORT || '3000';
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/mestodb';

const routes = require('./routes/index');

const app = express();

mongoose.connect(DATABASE_URL);

app.use(express.json());

// Временное решение с захардкоженным id пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '64cb737653d99ed14a8760c5',
  };

  next();
});

app.use('/users', routes.userRoute);
app.use('/cards', routes.cardRoute);
app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(port);
