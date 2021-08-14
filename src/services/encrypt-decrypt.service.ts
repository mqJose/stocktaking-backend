import CryptoJs from 'crypto-js';
import {EncryptDecryptKey as key} from '../keys/encrypt-decrypt.key';
import {SystemMessage as msg} from '../messages/system.message';
// const CryptoJs = require('crypto-js');

export class EncryptDecrypt {
  type: string;

  constructor(type: string){
    this.type = type;
  }

  public encrypt (text: string) {
    switch (this.type) {
      case key.MD5:
        return CryptoJs.MD5(text).toString();

      case key.AES:
        return CryptoJs.AES.encrypt(text, key.AES_SECRET_KEY).toString();

      case key.SHA_512:
        return CryptoJs.MD5(text).toString();

      default:
        return msg.NO_KEY;
    }
  }
}
