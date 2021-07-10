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
    handler: handler.updateMusicByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: handler.deleteMusicByIdHandler,
  },
];

module.exports = routes;
