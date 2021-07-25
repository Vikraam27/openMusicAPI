const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationModels } = require('./models');

const CollaborationsValidator = {
  validateCollaborationModels: (model) => {
    const validationResult = CollaborationModels.validate(model);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
