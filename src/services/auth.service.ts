import {repository} from '@loopback/repository';
import {generate as generator} from 'generate-password';
import {PasswordKey as pass} from '../keys/config-file';
import {EncryptDecryptKey as key} from '../keys/encrypt-decrypt.key';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {EncryptDecrypt} from './encrypt-decrypt.service';
// import {sign, verify} from 'jsonwebtoken'
const jwt = require("jsonwebtoken");

export class AuthService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }

  public async identify(email: string, password: string): Promise<User | false>{
    const user = await this.userRepository.findOne({where:{email}})
    if(user) {
      const cryptPassword = new EncryptDecrypt(key.LOGIN_CRYPT_METHOD).encrypt(password);
      if(user.password === cryptPassword) {
        return user;
      }
    }
    return false;
  }

  public async generateToken(user: User) {
    user.password = '';
    // const token = sign({
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

  public async verifyToken(token: string) {
    try {
      // return verify(token, key.JWT_SECRET_KEY).data;
      return jwt.verify(token, key.JWT_SECRET_KEY).data;
    } catch (error) {
      return false;
    }
  }

  public async resetPassword(email: string): Promise< string | false> {
    const user = await this.userRepository.findOne({ where:{ email }});
    if (user) {
      const randomPassword = generator({
        length: pass.LENGTH,
        numbers: pass.NUMBERS,
        lowercase: pass.LOWERCASE,
        uppercase: pass.UPPERCASE,
        symbols: pass.SYMBOLS
      });
      const crypter = new EncryptDecrypt(key.LOGIN_CRYPT_METHOD);
      const password = crypter.encrypt(crypter.encrypt(randomPassword));
      user.password = password;
      // eslint-disable-next-line no-void
      void this.userRepository.replaceById(user.id, user);
      return randomPassword;
    }
    return false;
  }
}
