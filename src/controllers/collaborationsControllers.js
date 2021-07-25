const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class CollaborationsControllers {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(userId, playlistId) {
    const id = `colab-${nanoid(10)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING collaboration_id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('failed add collaboration');
    }

    return result.rows[0].collaboration_id;
  }

  async deleteCollaboration(userId, playlistId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE user_id = $1 AND playlist_id = $2 RETURNING collaboration_id',
      values: [userId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('failed to delete playlist');
    }
  }

  async verifyCollaboration(userId, playlistId) {
    const query = {
      text: 'SELECT collaboration_id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('failed verify collaboration');
    }
  }
}

module.exports = CollaborationsControllers;
