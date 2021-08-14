import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {EncryptDecryptKey as key} from '../keys/encrypt-decrypt.key';
import {User} from '../models';
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class SessionsService {
  constructor(/* Add @inject to inject parameters */) { }

  /**
   * public function generarToken
   *
   * @param {User} user
   * @returns {string}
   * @memberof SessionsService
   */
  public generarToken(user: User): string {

    user.password = '';
    const token = jwt.sign({
      exp: key.TOKEN_EXPIRATION_TIME,
      data: {
        _id: user.id,
        email: user.email,
        role: user.role,
        patternId: user.stPersonId
      }
    },
    key.JWT_SECRET_KEY);
    return token;
  }

  /**
   * Verificar la validéz de un token JWT
   */
  public verificarTokenJWT(token: string) {
    try {
      return jwt.verify(token, key.JWT_SECRET_KEY);
    } catch {
      return null;
    }
  }

}
