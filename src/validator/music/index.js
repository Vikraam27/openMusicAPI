const InvariantError = require('../../exceptions/InvariantError');
const { OpenMusicModels } = require('./models');

const MusicValidator = {
  validateMusicModel: (model) => {
    const validationResult = OpenMusicModels.validate(model);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = MusicValidator;
