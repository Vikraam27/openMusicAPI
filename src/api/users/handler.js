class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.createUserHandler = this.createUserHandler.bind(this);
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
}

module.exports = UsersHandler;
