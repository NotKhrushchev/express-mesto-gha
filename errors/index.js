const AccessErr = require('./AccessErr');
const AuthorizationErr = require('./AuthorizationErr');
const BadRequestErr = require('./BadRequestErr');
const DuplicateEmailErr = require('./DuplicateEmailErr');
const NotFoundErr = require('./NotFoundErr');

module.exports = {
  BadRequestErr,
  DuplicateEmailErr,
  AuthorizationErr,
  NotFoundErr,
  AccessErr,
};
