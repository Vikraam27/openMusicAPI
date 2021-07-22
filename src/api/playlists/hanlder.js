class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.createPlaylistHanlder = this.createPlaylistHanlder.bind(this);
    this.getAllPlaylistHanlder = this.getAllPlaylistHanlder.bind(this);
  }

  async createPlaylistHanlder(request, h) {
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

  async getAllPlaylistHanlder(request) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._service.getAllMyPlaylists(credentialId);
      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = PlaylistHandler;
