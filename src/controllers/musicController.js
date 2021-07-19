const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const { mapDBToModel } = require('../utils');
const NotFoundError = require('../exceptions/NotFoundError');
const search = require('../utils/searchHandler');

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

    const query = {
      text: 'INSERT INTO musics VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, createdAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // select or get all data from musics table
  async getAllMusics({ song, performer }) {
    // for searching song
    if (song) {
      const reqeust = search(song, 'title');
      const result = await this._pool.query(reqeust);
      return result.rows;
    }
    // for searching performer
    if (performer) {
      const request = search(performer, 'performer');
      const result = await this._pool.query(request);
      return result.rows;
    }

    const result = await this._pool.query('SELECT id, title, performer FROM musics');
    return result.rows;
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
