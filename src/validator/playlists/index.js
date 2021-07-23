const { PlaylistsModels, PlaylistsSongModels } = require('./models');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
  validatePlaylistsModels: (model) => {
    const validationResult = PlaylistsModels.validate(model);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistsSongModels: (model) => {
    const validationResult = PlaylistsSongModels.validate(model);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
