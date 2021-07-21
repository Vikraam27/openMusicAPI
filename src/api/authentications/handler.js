class AuthenticationsHandler {
  constructor(authenticationsControllers, userControllers, tokenManager, validator) {
    this._authenticationsControllers = authenticationsControllers;
    this._userControllers = userControllers;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationModels(request.payload);

      const { username, password } = request.payload;
      const id = await this._userControllers.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsControllers.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async putAuthenticationHandler(request) {
    try {
      this._validator.validatePutAuthenticationModels(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsControllers.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deleteAuthenticationHandler(request) {
    try {
      this._validator.validateDeleteAuthenticationModels(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsControllers.verifyRefreshToken(refreshToken);
      await this._authenticationsControllers.deleteRefreshToken(refreshToken);
      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = AuthenticationsHandler;
