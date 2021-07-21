const {
  PostAuthenticationModels,
  PutAuthenticationModels,
  DeleteAuthenticationModels,
} = require('./models');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validatePostAuthenticationModels: (model) => {
    const validationResult = PostAuthenticationModels.validate(model);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuthenticationModels: (model) => {
    const validationResult = PutAuthenticationModels.validate(model);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationModels: (model) => {
    const validationResult = DeleteAuthenticationModels.validate(model);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
