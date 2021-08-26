const ExportSongsInPlaylistModels = require('./models');
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
  validateExportSongsInPlaylistModels: (model) => {
    const validationResult = ExportSongsInPlaylistModels.validate(model);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
