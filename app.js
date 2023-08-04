const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = process.env.PORT || '3000';
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/mestodb';

const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');

const app = express();

mongoose.connect(DATABASE_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Временное решение с захардкоженным id пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '64cb737653d99ed14a8760c5'
  };

  next();
});

app.use('/users', userRoute);
app.use('/cards', cardRoute);

app.listen(port);