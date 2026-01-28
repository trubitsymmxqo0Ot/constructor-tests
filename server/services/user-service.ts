import userDTO from "../dto/UserDTO.ts";
import tokenService from "./token-service.ts";
import db from "../bd.ts";
import type { User } from "../types/types.ts";
import type { QueryResult } from "pg";
import bcrypt from 'bcrypt';
import ErrorFabric from "../exceptions/ErrorFabric.ts";

class UserServices {
  async register(email: string, password: string) {
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const tryFindPerson = await db.query(
        `SELECT * FROM person WHERE email = $1`,
        [email],
      );
      if (tryFindPerson.rows[0]) {
        throw ErrorFabric.BadRequest('Пользователь уже существует!');
      }
      await db.query(`INSERT INTO person (email, password) VALUES ($1, $2)`, [
        email,
        hashPassword,
      ]);
      const tryFindCreatedPerson = await db.query(
        `SELECT * FROM person WHERE email = $1`,
        [email],
      );
      if (!tryFindCreatedPerson.rows) {
        throw ErrorFabric.BadRequest("Пользователя не удалось создать");
      }
      const getUserDTO = new userDTO(tryFindCreatedPerson.rows[0]);
      const generateTokens = tokenService.generateTokens({ ...getUserDTO });
      await tokenService.saveToken(getUserDTO.id, generateTokens.refreshToken);
      return {
        getUserDTO,
        generateTokens,
      };
    } catch (e) {
      if (e instanceof Error) {
        throw ErrorFabric.BadRequest(e.message);
      }
    }
  }
  async login(email: string, password: string) {
    try {
      const findPerson = await db.query(`SELECT * FROM person WHERE email = $1`, [email]);
      if(!findPerson.rows[0]) {
        throw ErrorFabric.BadRequest('Неверный логин или пароль!');
      }
      const verifyPassword = await bcrypt.compare(password, findPerson.rows[0].password,);
      if(!verifyPassword) {
        throw ErrorFabric.BadRequest('Неверный логин или пароль!');
      }
      const getUserDTO = new userDTO(findPerson.rows[0]);
      const generateNewToken = tokenService.generateTokens({...getUserDTO});
      await tokenService.saveToken(getUserDTO.id, generateNewToken.refreshToken);
      return {
        getUserDTO,
        generateNewToken,
      } 
    } catch(e) {
      if(e instanceof Error) {
        throw ErrorFabric.BadRequest(e.message);
      }
    }
  }
  async logout(email: string, token: string) {
    try {
      const findUser = await db.query(`SELECT * FROM person WHERE email = $1`, [email]);
      if(!findUser.rows[0]) {
        throw ErrorFabric.BadRequest('Пользователь не найден');
      }
      await tokenService.deleteToken(token);
    } catch(e) {
      if(e instanceof Error) {
        throw ErrorFabric.BadRequest(e.message);
      }
    }
  }
  async refresh(refreshToken: string) {
    try {
      const verifyToken = tokenService.verifyRefreshToken(refreshToken);
      const findToken = await tokenService.tryFindToken(refreshToken);
      if (!verifyToken || !findToken) {
        throw ErrorFabric.UserNotAuthorization();
      }
      const getInfoUser: QueryResult<User> = await db.query(
        `SELECT * FROM person WHERE id = $1`,
        [findToken?.id],
      );
      if (!getInfoUser.rows[0]) {
        throw ErrorFabric.BadRequest("Пользователь не найден");
      }
      const getUserDTO = new userDTO(getInfoUser.rows[0]);
      const generateNewToken = tokenService.generateTokens({ ...getUserDTO });
      await tokenService.saveToken(getUserDTO.id, generateNewToken.refreshToken);
      return {
        getUserDTO,
        generateNewToken,
      }
    } catch (e) {
      if (e instanceof Error) {
        throw ErrorFabric.BadRequest(e.message);
      }
    }
  }
}

export default new UserServices();
