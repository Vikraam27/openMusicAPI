class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.createUserHandler = this.createUserHandler.bind(this);
    this.getUserHandler = this.getUserHandler.bind(this);
    this.searchUsernameHandler = this.searchUsernameHandler.bind(this);
  }

  async createUserHandler(request, h) {
    try {
      this._validator.validateUserModels(request.payload);

      const { username, password, fullname } = request.payload;

      const userId = await this._service.createUser({ username, password, fullname });

      const response = h.response({
        status: 'success',
        message: 'registration successfully',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getUserHandler(request) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const user = await this._service.getUser(credentialId);
      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async searchUsernameHandler(request) {
    try {
      const { username } = request.query;
      const user = await this._service.searchUsername(username);

      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = UsersHandler;
