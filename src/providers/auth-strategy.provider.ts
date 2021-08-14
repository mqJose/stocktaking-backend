import {
  AuthenticationBindings,
  AuthenticationMetadata
} from '@loopback/authentication';
import {inject, Provider, ValueOrPromise} from '@loopback/core';
// import {inject, Provider, ValueOrPromise} from '@loopback/authentication/node_modules/@loopback/context';
// import {inject, Provider, ValueOrPromise} from '@loopback/context-explorer';
import {repository} from '@loopback/repository';
import {Strategy} from 'passport';
import {BasicStrategy} from 'passport-http';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {RoleKey} from '../keys/role.key';
import {StrategyKey} from '../keys/strategy.key';
import {UserRepository} from '../repositories';
import {AuthService} from '../services/auth.service';
export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {

  public authService: AuthService;

  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @repository(UserRepository)
    public userRepository: UserRepository
  ) {
    this.authService = new AuthService(userRepository);
  }

  value(): ValueOrPromise<Strategy | undefined> {
    // The function was not decorated, so we shouldn't attempt authentication
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    switch (name) {
      case StrategyKey.BASIC:
        return new BasicStrategy(this.verifyUser.bind(this));
      case StrategyKey.ADMIN:
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return new BearerStrategy(this.verifyAdminToken.bind(this));
      case StrategyKey.CLIENT:
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return new BearerStrategy(this.verifyClientToken.bind(this));
      default:
        return Promise.reject(`The strategy ${name} is not available.`);
        break;
    }
  }

  public async verifyUser(
    username: string,
    password: string, cb: (
    err: Error | null, user?: object | false) => void,
  ) {
    const user = await this.authService.identify(username, password);
    return cb(null, user);
  }

  public async verifyAdminToken(
    token: string,
    cb: (err: Error | null, user?: object | false) => void
  ){
    await this.authService.verifyToken(token)
    .then(
      (data) => {
        if(data && data.role === RoleKey.ADMIN) {
          return cb(null, data);
        } else {
          return cb(null, false);
        }
      });
  }

  public async verifyClientToken(
    token: string,
    cb: (err: Error | null, user?: object | false) => void
  ){
    await this.authService.verifyToken(token)
    .then(
      (data) => {
        if (data && data.role === RoleKey.CLIENT) {
          return cb(null, data);
        } else {
          return cb(null, false);
        }
      });
  }
}

