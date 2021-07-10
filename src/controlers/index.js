const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const { mapData, mapDBToModel } = require('../utils');
const NotFoundError = require('../exceptions/NotFoundError');

class MusicControllers {
  constructor() {
    this._pool = new Pool();
  }

  // insert music into table musics
  async addMusic({
    title, year, performer, genre, duration,
  }) {
    const id = `song-${nanoid(8)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO musics VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // select or get all data from musics table
  async getAllMusics() {
    const result = await this._pool.query('SELECT * FROM musics');
    return result.rows.map(mapData);
  }

  // get music details
  async getMusicDetails({ songId }) {
    const query = {
      text: 'SELECT * FROM musics WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(`Lagu dengan id ${songId} tidak ditemukan, silahkan periksa kembali id lagu.`);
    }

    return result.rows.map(mapDBToModel)[0];
  }
}

module.exports = MusicControllers;
