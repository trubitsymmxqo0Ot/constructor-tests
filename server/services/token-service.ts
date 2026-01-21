import jwt from 'jsonwebtoken';
import type { User } from '../types/types.ts';
import dotenv from 'dotenv';
import db from '../bd.ts';
import type { QueryResult } from 'pg';
dotenv.config({path: "../.env", override: true})

class tokenService {
  generateTokens(user: User) {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN || '', {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN || '', {
      expiresIn: '30d',
    })
    if(!accessToken && !refreshToken) {
      throw new Error('Один из токенов не удалось создать');
    }
    return {accessToken, refreshToken};
  }
  async saveToken(id: number, token: string) {
    try {
      const tryFindToken = await db.query(`SELECT * FROM token WHERE id = $1`, [id]);
      if(tryFindToken.rows[0]) {
        const response = await db.query(`UPDATE token SET refreshToken = $1 WHERE id = $2`, [token, id]);
        return response.rows[0];
      }
      await db.query(`INSERT INTO token (id, refreshToken) VALUES ($1, $2)`, [id, token]);
      const findToken = await db.query(`SELECT * FROM token WHERE id = $1`, [id]);
      if(!findToken.rows[0]) {
        throw new Error('Произошла неизвестная ошибка');
      }
      return findToken.rows[0];
    } catch(e) {
      if(e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }
  verifyRefreshToken(refreshToken: string) {
      const response = jwt.verify(refreshToken, process.env.REFRESH_TOKEN || '');
      return response;
  }
  async tryFindToken(refreshToken: string) {
    try {
      const findToken: QueryResult<User> = await db.query(`SELECT * FROM token WHERE refreshToken = $1`, [refreshToken]);
      if(!findToken.rows[0]) {
        throw new Error('Пользователь не авторизован');
      }
      return findToken.rows[0];
    } catch(e) {
      if(e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }
  async deleteToken(token: string) {
    try {
      const tryFindToken = await db.query(`SELECT * FROM token WHERE refreshToken = $1`, [token]);
      if(!tryFindToken.rows[0]) {
        throw new Error('Пользователь не авторизован');
      }
      const deleteToken = await db.query(`DELETE FROM token WHERE refreshToken = $1`, [token]);
      return deleteToken.rows[0];
    } catch(e) {
      if(e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }
}

export default new tokenService();