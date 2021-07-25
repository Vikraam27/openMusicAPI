const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  verison: '1.0.0',
  register: async (server, { collaborationControllers, playlistsControllers, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationControllers, playlistsControllers, validator,
    );

    server.route(routes(collaborationsHandler));
  },
};
