require('dotenv').config();

const Hapi = require('@hapi/hapi');

// music
const openMusic = require('./api/openMusic');
const MusicControllers = require('./controllers/musicController');
const MusicValidator = require('./validator/music');

// users
const users = require('./api/users');
const UserControllers = require('./controllers/userControllers');
const UserValidator = require('./validator/users');

// authentications

const authentications = require('./api/authentications');
const AuthenticationsControllers = require('./controllers/authenticationsControllers');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// error handler
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const musicControllers = new MusicControllers();
  const userControllers = new UserControllers();
  const authenticationsControllers = new AuthenticationsControllers();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: openMusic,
      options: {
        service: musicControllers,
        validator: MusicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userControllers,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsControllers,
        userControllers,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const clientErrorResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      clientErrorResponse.code(response.statusCode);
      return clientErrorResponse;
    }

    const serverError = h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami.',
    });
    serverError.code(500);

    return response.continue || response;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
