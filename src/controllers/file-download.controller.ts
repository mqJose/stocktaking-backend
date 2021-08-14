// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {inject} from '@loopback/core';
import {
  get,

  HttpErrors, oas,
  param,
  Response,
  RestBindings
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import {ks} from '../keys/config-file';

const readdir = promisify(fs.readdir);

/**
 * A controller to handle file downloads using multipart/form-data media type
 */
export class FileDownloadController {

  constructor(
  ) { }

  /**
   *
   * @param type
   * @param id
   */
  @get('/files/{type}', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  public async listFiles(
    @param.path.string('type') type: string,) {
    const folderPath = this.getFolderPathByType(type);
    const files = await readdir(folderPath);
    return files;
  }

  /**
   *
   * @param type
   * @param recordId
   * @param response
   */
  @get('/files/{type}/{filename}')
  @oas.response.file()
  async downloadFile(
    @param.path.string('type') type: string,
    @param.path.string('filename') filename: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const folderPath = this.getFolderPathByType(type);
    const file = this.validateFileName(folderPath, filename);
    response.download(file, folderPath);
    return response;
  }

  /**
   * Get the folder when files are uploaded by type
   * @param type
   */
  private getFolderPathByType(type = ''): string {
    if (type === 'documents') type = path.join(__dirname, ks.documentsFolder);
    if (type === 'pictures') type = path.join(__dirname, ks.picturesFolder);
    return type;
  }

  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private validateFileName(file: string, folder: string) {
    const resolved = path.resolve(file, folder);
    if (resolved.startsWith(file)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors[400](`This file path isnt exist: ${folder}`);
  }

}
