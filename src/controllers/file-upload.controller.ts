import {inject} from '@loopback/core';
import {
  HttpErrors,
  post,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {v4 as uuid} from 'uuid';
import {ks} from '../keys/config-file';

export class FileUploadController {
  constructor() { }

  /**
   *
   * @param response
   * @param request
   */
  @post('/picture-upload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Functionality by upload File (image).',
      },
    },
  })
  public async pictureUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object | false> {
    const pathFile = path.join(__dirname, ks.picturesFolder);
    const res = await this.storeFileToPath(pathFile, ks.nameField, request, response, ks.picturesExtensions, ks.picturesFileSize);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        return {filename};
      }
    }
    return res;
  }

  /**
   *
   * @param response
   * @param request
   */
  @post('/document-upload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Functionality by upload File (image).',
      },
    },
  })
  public async documentUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object | false> {
    const pathFile = path.join(__dirname, ks.documentsFolder);
    const res = await this.storeFileToPath(pathFile, ks.nameField, request, response, ks.documentsExtensions, ks.documentsFileSize);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        return {filename};
      }
    }
    return res;
  }


  /**
   * Return a config for multer storage
   * @param path
   */
  private getMulterStorageConfig(pathStorage: string) {
    let filename = '';
    const storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, path.resolve(pathStorage))
      },
      filename: (req, file, callback) => {
        filename = `${uuid()}-${Date.now()}-${file.originalname}`
        callback(null, filename);
      },
       });
    return storage;
  }

  /**
   * store the file in a specific path
   * @param storePath
   * @param request
   * @param response
   */
  private storeFileToPath(storePath: string, fieldname: string, request: Request, response: Response, acceptedExt: string[], fileSize: number): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const storage = this.getMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: (req, file, callback) => {
          const ext = path.extname(file.originalname).toUpperCase();
          return acceptedExt.includes(ext) ?
          callback(null, true) :
          callback(new HttpErrors[400]('This format isnt correct'))
        },
        limits: { fileSize }
      },
      ).single(fieldname);
      upload(request, response, (err) => err ? reject(err) : resolve(response));
    });
  }

}
