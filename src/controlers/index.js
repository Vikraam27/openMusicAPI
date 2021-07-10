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
  async getMusicDetails(songId) {
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

  // update music by id
  async updateMusic(songId, {
    title, year, performer, genre, duration,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE musics SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(`Lagu dengan id ${songId} tidak ditemukan, silahkan periksa kembali id lagu.`);
    }
  }

  // delete music by id
  async deleteMusic(songId) {
    const query = {
      text: 'DELETE FROM musics WHERE id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(`Lagu dengan id ${songId} tidak ditemukan, silahkan periksa kembali id lagu.`);
    }
  }
}

module.exports = MusicControllers;
