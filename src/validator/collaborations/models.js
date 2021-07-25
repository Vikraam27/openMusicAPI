const Joi = require('joi');

const CollaborationModels = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { CollaborationModels };
