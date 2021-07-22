const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.createPlaylistHanlder,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getAllPlaylistHanlder,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
