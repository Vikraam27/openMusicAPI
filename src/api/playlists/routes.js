const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.createPlaylistHalder,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
