const Joi = require('joi');

const PostAuthenticationModels = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const PutAuthenticationModels = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationModels = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  PostAuthenticationModels,
  PutAuthenticationModels,
  DeleteAuthenticationModels,
};
