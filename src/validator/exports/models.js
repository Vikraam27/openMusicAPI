const Joi = require('joi');

const ExportSongsInPlaylistModels = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportSongsInPlaylistModels;
