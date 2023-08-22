const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const { UNAUTHORIZED } = StatusCodes;

const authError = { message: 'Необходима авторизация' };

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).send(authError);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    return res.status(UNAUTHORIZED).send(authError);
  }
  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
