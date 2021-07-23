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

  async verifySongId(songId) {
    const query = {
      text: 'SELECT id FROM musics WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('music not found');
    }
  }

  async addSongToPlaylists(songId, playlistId) {
    const id = `playlists-song-${nanoid(10)}`;
    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('failed to add song to playlist');
    }
  }

  async getSongInPlaylists(owner, playlistId) {
    const query = {
      text: `SELECT musics.id, musics.title, musics.performer FROM musics 
      LEFT JOIN playlists_songs ON playlists_songs.song_id = musics.id
      LEFT JOIN playlists ON playlists.id = playlists_songs.playlists_id
      WHERE playlists.owner = $1 AND playlists.id = $2`,
      values: [owner, playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteSongInPlaylists(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlists_songs WHERE playlists_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('failed delete song, id not found');
    }
  }
}

module.exports = PlaylistsControllers;
