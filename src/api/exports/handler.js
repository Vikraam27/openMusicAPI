class ExportHandler {
  constructor(service, validator, playlistsControllers) {
    this._service = service;
    this._validator = validator;
    this._playlistsControllers = playlistsControllers;

    this.postExportSongsInPlaylist = this.postExportSongsInPlaylist.bind(this);
  }

  async postExportSongsInPlaylist(request, h) {
    try {
      this._validator.validateExportSongsInPlaylistModels(request.payload);

      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistsControllers.verifyPlaylistOwner(credentialId, playlistId);
      const message = {
        userId: credentialId,
        targetEmail: request.payload.targetEmail,
        playlistId,
      };

      await this._service.sendMessage('export:playlist', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = ExportHandler;
