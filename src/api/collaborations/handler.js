class CollaborationsHandler {
  constructor(collaborationControllers, playlistsControllers, validator) {
    this._collaborationControllers = collaborationControllers;
    this._playlistsControllers = playlistsControllers;
    this._validator = validator;

    this.addCollaborationHandler = this.addCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async addCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationModels(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistsControllers.verifyPlaylistOwner(credentialId, playlistId);

      // eslint-disable-next-line max-len
      const collaborationId = await this._collaborationControllers.addCollaboration(userId, playlistId);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async deleteCollaborationHandler(request) {
    try {
      this._validator.validateCollaborationModels(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistsControllers.verifyPlaylistOwner(credentialId, playlistId);
      await this._collaborationControllers.deleteCollaboration(userId, playlistId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = CollaborationsHandler;
