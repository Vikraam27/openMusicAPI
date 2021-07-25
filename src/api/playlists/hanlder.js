class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.createPlaylistHanlder = this.createPlaylistHanlder.bind(this);
    this.getAllPlaylistHanlder = this.getAllPlaylistHanlder.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.addSongToPlaylistsHandler = this.addSongToPlaylistsHandler.bind(this);
    this.getAllMusicsInPlaylistsHandler = this.getAllMusicsInPlaylistsHandler.bind(this);
    this.deleteSongInPlaylistsHandler = this.deleteSongInPlaylistsHandler.bind(this);
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
      return error;
    }
  }

  async deletePlaylistHandler(request) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      await this._service.verifyPlaylistOwner(credentialId, playlistId);

      await this._service.verifyPlaylistAccess(credentialId, playlistId);
      await this._service.deletePlaylist(playlistId);
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }

  async addSongToPlaylistsHandler(request, h) {
    try {
      this._validator.validatePlaylistsSongModels(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      const { songId } = request.payload;

      await this._service.verifyPlaylistAccess(credentialId, playlistId);
      await this._service.verifySongId(songId);

      await this._service.addSongToPlaylists(songId, playlistId);
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getAllMusicsInPlaylistsHandler(request) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;

      await this._service.verifyPlaylistAccess(credentialId, playlistId);
      const songs = await this._service.getSongInPlaylists(credentialId, playlistId);

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

  async deleteSongInPlaylistsHandler(request) {
    try {
      await this._validator.validatePlaylistsSongModels(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      const { songId } = request.payload;

      await this._service.verifyPlaylistAccess(credentialId, playlistId);

      await this._service.deleteSongInPlaylists(playlistId, songId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = PlaylistHandler;
