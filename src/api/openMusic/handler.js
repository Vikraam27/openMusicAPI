const ClientError = require('../../exceptions/ClientError');

class OpenMusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMusicHandler = this.postMusicHandler.bind(this);
  }

  async postMusicHandler(request, h) {
    try {
      this._validator.validateMusicModel(request.payload);
      const {
        title, year, performer, genre, duration,
      } = request.payload;

      const musicId = await this._service.addMusic({
        title, year, performer, genre, duration,
      });
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId: musicId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = OpenMusicHandler;
