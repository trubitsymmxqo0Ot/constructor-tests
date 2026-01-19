import db from '../bd.ts';
import SQLHelpers from '../selectDBHelpers/SQLHelpers.ts';

class Controllers {
  async register(req, res, next) {
    try {
      const {name, email, password} = req.body;
      const tryFindPerson = await SQLHelpers.tryFindUser(email);
      if(tryFindPerson?.rows.length !== 0) {
        throw new Error(`Пользователь с ${email} уже существует`);
      }
      return {
        message: 'Пользователь создан'
      }
    } catch(e) {
      next(e);
    }
  }
}

export default Controllers;