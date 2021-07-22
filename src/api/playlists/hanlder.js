class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.createPlaylistHalder = this.createPlaylistHalder.bind(this);
  }

  async createPlaylistHalder(request, h) {
    try {
      this._validator.validatePlaylistsModels(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.createPlaylist(name, credentialId);

      const response = h.response({
        status: 'success',
        message: 'playlist created',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = PlaylistHandler;
