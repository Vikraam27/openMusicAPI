const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class PlaylistsControllers {
  constructor() {
    this._pool = new Pool();
  }

  async createPlaylist(name, owner) {
    const id = `playlist-${nanoid(10)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('failed adding playlist');
    }

    return result.rows[0].id;
  }

  async getAllMyPlaylists(owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists FULL OUTER JOIN users ON users.id = playlists.owner WHERE playlists.owner = $1',
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsControllers;
