const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../exceptions/AuthorizationError');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistsControllers {
  constructor(collaborationControllers, cacheControllers) {
    this._pool = new Pool();
    this._collaborationControllers = collaborationControllers;
    this._cacheControllers = cacheControllers;
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
        LEFT JOIN users 
        ON playlists.owner = users.id
        LEFT JOIN collaborations
        ON collaborations.playlist_id = playlists.id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
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
      throw new NotFoundError(`Lagu dengan id ${playlistId} tidak ditemukan, silahkan periksa kembali id lagu.`);
    }
  }

  async verifyPlaylistOwner(owner, playlistId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
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
    await this._cacheControllers.delete(`playlist-song:${playlistId}`);
  }

  async getSongInPlaylists(owner, playlistId) {
    try {
      const request = await this._cacheControllers.get(`playlist-song:${playlistId}`);
      return JSON.parse(request);
    } catch {
      const query = {
        text: `SELECT musics.id, musics.title, musics.performer FROM musics 
        LEFT JOIN playlists_songs ON playlists_songs.song_id = musics.id
        LEFT JOIN playlists ON playlists.id = playlists_songs.playlists_id
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists_songs.playlists_id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1 AND playlists.id = $2`,
        values: [owner, playlistId],
      };

      const result = await this._pool.query(query);

      await this._cacheControllers.set(`playlist-song:${playlistId}`, JSON.stringify(result));

      return result.rows;
    }
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
    await this._cacheControllers.delete(`playlist-song:${playlistId}`);
  }

  async verifyPlaylistAccess(userId, playlistId) {
    try {
      await this.verifyPlaylistOwner(userId, playlistId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationControllers.verifyCollaboration(userId, playlistId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsControllers;
