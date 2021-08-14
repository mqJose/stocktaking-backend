// import {repository} from '@loopback/repository';
// import {EncryptDecryptKey as key} from '../keys/encrypt-decrypt.key';
// import {User} from '../models';
// import {generate as generator} from 'generate-password';
// import {UserRepository} from '../repositories';
// import {EncryptDecrypt} from './encrypt-decrypt.service';
// const jwt = require("jsonwebtoken");

// export class AuthService {
//   constructor(
//     @repository(UserRepository)
//     public userRepository: UserRepository
//   ) { }

//   /**
//    * Reset the user password when it is missed
//    * @param username
//    */
//   async ResetPassword(username: string): Promise<string | false> {
//     let user = await this.userRepository.findOne({where: {username: username}});
//     if (user) {
//       let randomPassword = generator({
//         length: passKeys.LENGTH,
//         numbers: passKeys.NUMBERS,
//         lowercase: passKeys.LOWERCASE,
//         uppercase: passKeys.UPPERCASE
//       });
//       let crypter = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD);
//       let password = crypter.Encrypt(crypter.Encrypt(randomPassword));
//       user.password = password;
//       this.userRepository.replaceById(user.id, user);
//       return randomPassword;
//     }
//     return false;
//   }
// }
