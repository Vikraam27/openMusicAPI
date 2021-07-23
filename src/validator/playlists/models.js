const Joi = require('joi');

const PlaylistsModels = Joi.object({
  name: Joi.string().required(),
});

const PlaylistsSongModels = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistsModels, PlaylistsSongModels };
