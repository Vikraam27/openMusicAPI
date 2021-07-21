const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { hash } = require('bcrypt');
const publicIp = require('public-ip');
const InvariantError = require('../exceptions/InvariantError');

class UserControllers {
  constructor() {
    this._pool = new Pool();
  }

  async createUser({ username, password, fullname }) {
    await this.verifyUsername(username);

    const userId = `user-${nanoid(10)}`;
    const hashPassword = await hash(password, 10);
    const createdAt = new Date().toISOString();
    const userIpAddress = await publicIp.v4();

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [userId, username, hashPassword, fullname, createdAt, userIpAddress],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw InvariantError('register user failed');
    }
    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('username already exists');
    }
  }
}

module.exports = UserControllers;
