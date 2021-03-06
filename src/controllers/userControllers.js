const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { hash, compare } = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class UserControllers {
  constructor() {
    this._pool = new Pool();
  }

  async createUser({ username, password, fullname }) {
    await this.verifyUsername(username);

    const userId = `user-${nanoid(10)}`;
    const hashPassword = await hash(password, 10);
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [userId, username, hashPassword, fullname, createdAt],
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

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('invalid username');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('invalid password');
    }
    return id;
  }

  async getUser(id) {
    const query = {
      text: 'SELECT id, username, fullname, created_at FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('user not found');
    }

    return result.rows[0];
  }

  async searchUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE LOWER(username) LIKE \'%\' || $1 || \'%\' LIMIT 2',
      values: [username.toLowerCase()],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = UserControllers;
