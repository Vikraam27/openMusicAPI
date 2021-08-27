require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

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

// playlist
const playlists = require('./api/playlists');
const PlaylistsControllers = require('./controllers/playlistControllers');
const PlaylistsValidator = require('./validator/playlists');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsControllers = require('./controllers/collaborationsControllers');
const CollaborationsValidator = require('./validator/collaborations');

// exports
const _exports = require('./api/exports');
const ProducerControllers = require('./controllers/rabbitmq/ProducerControllers');
const ExportsValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./controllers/storage/StorageControllers');
const UploadsValidator = require('./validator/uploads');

// cache
const CacheControllers = require('./controllers/redis/CacheControllers');

// error handler
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const cacheControllers = new CacheControllers();
  const collaborationsControllers = new CollaborationsControllers(cacheControllers);
  const musicControllers = new MusicControllers();
  const userControllers = new UserControllers();
  const authenticationsControllers = new AuthenticationsControllers();
  // eslint-disable-next-line max-len
  const playlistsControllers = new PlaylistsControllers(collaborationsControllers, cacheControllers);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

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
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: playlists,
      options: {
        service: playlistsControllers,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationControllers: collaborationsControllers,
        playlistsControllers,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerControllers,
        validator: ExportsValidator,
        playlistsControllers,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
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
