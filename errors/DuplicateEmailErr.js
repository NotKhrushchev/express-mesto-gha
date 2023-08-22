const { UNAUTHORIZED } = require('http-status-codes').StatusCodes;

class DuplicateEmailErr extends Error {
  constructor(message = 'Указанный email уже существует') {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = DuplicateEmailErr;
