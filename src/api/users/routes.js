const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.createUserHandler,
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUserHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/finduser',
    handler: handler.searchUsernameHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
