const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const port = process.env.PORT || '3000';
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/mestodb';

const routes = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { NotFoundErr } = require('./errors');
const { errorHandler } = require('./middlewares/errorHandler');
const { signupCelebrate, signinCelebrate } = require('./middlewares/celebrateValidators');

const app = express();

mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use(helmet());
app.use(limiter);

// Роут аутентификации
app.post('/signin', signinCelebrate, login);

// Роут регистрации
app.post('/signup', signupCelebrate, createUser);

app.use(auth);

app.use('/users', routes.userRoute);
app.use('/cards', routes.cardRoute);
app.use('*', () => {
  throw new NotFoundErr('Страница не найдена');
});

app.use(errors());
app.use(errorHandler);

app.listen(port);
