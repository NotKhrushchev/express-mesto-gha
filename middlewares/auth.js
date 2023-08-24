const jwt = require('jsonwebtoken');
const { AuthorizationErr } = require('../errors');

const authError = 'Необходима авторизация';

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationErr(authError);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    next(new AuthorizationErr(authError));
  }
  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
