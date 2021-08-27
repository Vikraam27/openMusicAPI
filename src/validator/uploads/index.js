const InvariantError = require('../../exceptions/InvariantError');
const { ImageHeadersModels } = require('./models');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersModels.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
