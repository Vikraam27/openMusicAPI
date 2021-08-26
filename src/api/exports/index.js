const ExportHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, validator, playlistsControllers }) => {
    const exportHandler = new ExportHandler(service, validator, playlistsControllers);
    server.route(routes(exportHandler));
  },
};
