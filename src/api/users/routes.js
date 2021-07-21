const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.createUserHandler,
  },
];

module.exports = routes;
