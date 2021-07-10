const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postMusicHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAllMusicHandler,
  },
  {
    method: 'GET',
    path: '/songs/{songId}',
    handler: handler.getMusicByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{songId}',
    handler: handler.updatetMusicByIdHandler,
  },
];

module.exports = routes;
