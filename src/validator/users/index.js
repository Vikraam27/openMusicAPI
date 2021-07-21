const { UserModels } = require('./model');
const InvariantError = require('../../exceptions/InvariantError');

const usersValidator = {
  validateUserModels: (model) => {
    const validationResult = UserModels.validate(model);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = usersValidator;
