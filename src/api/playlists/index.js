const PlaylistHandler = require('./hanlder');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: 'V.1.0.0',
  register: async (server, { service, validator }) => {
    const playlistsHandler = new PlaylistHandler(service, validator);
    server.route(routes(playlistsHandler));
  },
};
