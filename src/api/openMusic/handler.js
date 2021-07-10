const ClientError = require('../../exceptions/ClientError');

class OpenMusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMusicHandler = this.postMusicHandler.bind(this);
    this.getAllMusicHandler = this.getAllMusicHandler.bind(this);
    this.getMusicByIdHandler = this.getMusicByIdHandler.bind(this);
    this.updateMusicByIdHandler = this.updateMusicByIdHandler.bind(this);
    this.deleteMusicByIdHandler = this.deleteMusicByIdHandler.bind(this);
  }

  // POST request add song
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

  // GET request show all song
  async getAllMusicHandler() {
    const songs = await this._service.getAllMusics();

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  // GET request show music details by id
  async getMusicByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      const song = await this._service.getMusicDetails(songId);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
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
      console.error(error);
      return response;
    }
  }

  // PUT request for updating song data by id
  async updateMusicByIdHandler(request, h) {
    try {
      this._validator.validateMusicModel(request.payload);
      const { songId } = request.params;

      await this._service.updateMusic(songId, request.payload);
      return {
        status: 'success',
        message: 'lagu berhasil diperbarui',
      };
    } catch (error) {
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
      console.error(error);
      return response;
    }
  }

  // DELETE request for deleting music by id
  async deleteMusicByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      await this._service.deleteMusic(songId);

      return {
        status: 'success',
        message: 'lagu berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}
module.exports = OpenMusicHandler;
