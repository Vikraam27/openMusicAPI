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
      return error;
    }
  }

  // GET request show all song
  async getAllMusicHandler(request) {
    try {
      const songs = await this._service.getAllMusics(request.query);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      return error;
    }
  }

  // GET request show music details by id
  async getMusicByIdHandler(request) {
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
      return error;
    }
  }

  // PUT request for updating song data by id
  async updateMusicByIdHandler(request) {
    try {
      this._validator.validateMusicModel(request.payload);
      const { songId } = request.params;

      await this._service.updateMusic(songId, request.payload);
      return {
        status: 'success',
        message: 'lagu berhasil diperbarui',
      };
    } catch (error) {
      return error;
    }
  }

  // DELETE request for deleting music by id
  async deleteMusicByIdHandler(request) {
    try {
      const { songId } = request.params;
      await this._service.deleteMusic(songId);

      return {
        status: 'success',
        message: 'lagu berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}
module.exports = OpenMusicHandler;
