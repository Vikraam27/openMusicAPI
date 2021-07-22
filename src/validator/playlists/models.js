const Joi = require('joi');

const PlaylistsModels = Joi.object({
  name: Joi.string().required(),
});

module.exports = { PlaylistsModels };
