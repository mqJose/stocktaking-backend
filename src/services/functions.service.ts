import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import CryptoJs from 'crypto-js';
const generator = require('generate-password');

@injectable({scope: BindingScope.TRANSIENT})
export class FunctionsService {
  constructor(/* Add @inject to inject parameters */) {}

  /**
   * Function by Generate Random Key
   *
   * @returns {string}
   * @memberof FunctionsService
   */
  public generateRandomKey(): string {
    return generator.generate({
      length: 12,
      numbers: true,
      symbols: false,
      uppercase: true,
      lowercase: true
    })
  }


  /**
   * Function by Encrypt Text with MD5
   *
   * @param {string} text
   * @returns {string}
   * @memberof FunctionsService
   */
  public cryptTextMD5(text: string): string {
    return CryptoJs.MD5(text).toString()
  }
}
