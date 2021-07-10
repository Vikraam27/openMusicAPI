require('dotenv').config();

const Hapi = require('@hapi/hapi');
const openMusic = require('./api/openMusic');
const OpenMusicService = require('./controlers');
const MusicValidator = require('./validator');

const init = async () => {
  const openMusicService = new OpenMusicService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: openMusic,
    options: {
      service: openMusicService,
      validator: MusicValidator,
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
