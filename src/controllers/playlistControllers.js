const { nanoid } = require('nanoid');
const { Pool } = require('pg');

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

    return result.rows[0].id;
  }
}

module.exports = PlaylistsControllers;
