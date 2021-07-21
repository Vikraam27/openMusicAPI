const { Pool } = require('pg');
const publicIp = require('public-ip');
const InvariantError = require('../exceptions/InvariantError');

class AuthenticationsControllers {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const createdAt = new Date().toISOString();
    const userIpAddress = await publicIp.v4();

    const query = {
      text: 'INSERT INTO authentications VALUES($1, $2, $3)',
      values: [token, createdAt, userIpAddress],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('invalid refresh token');
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationsControllers;
