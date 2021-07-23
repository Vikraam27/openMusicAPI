const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../exceptions/AuthorizationError');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

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
      text: `SELECT playlists.id, playlists.name, users.username 
        FROM playlists 
        FULL OUTER JOIN users 
        ON users.id = playlists.owner 
        WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(`failed delete playlist, id ${playlistId} not found`);
    }
  }

  async verifyPlaylistOwner(owner, playlistId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(`failed delete playlist, id ${playlistId} not found`);
    }

    const { owner: playlistOwner } = result.rows[0];

    if (owner !== playlistOwner) {
      throw new AuthorizationError('you cant access this resource');
    }
  }
}

module.exports = PlaylistsControllers;
