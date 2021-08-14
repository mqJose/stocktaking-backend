import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AuthenticationDatasource} from '../datasources/authentication';
import {SessionsService} from '../services';

export class OperatorStrategy implements AuthenticationStrategy {
  public name = 'operator';

  constructor(
    @service(SessionsService)
    public sessionsService: SessionsService
    ) {

  }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = parseBearerToken(request);
    if (!token) {
      throw new HttpErrors[401]("Usted no ha suministrado un token");
    }
    const session = this.sessionsService.verificarTokenJWT(token);
    if (session) {
      const {data:{email, role}} = session;
      if (role === AuthenticationDatasource.ROLE_ADMIN) {
        const profileData: UserProfile = Object.assign({ email, role });
        return profileData;
      } else {
        throw new HttpErrors[401]("Usted no tiene el rol para ejecutar esta acción.")
      }
    } else {
      throw new HttpErrors[401]("Usted no tiene un token válido");
    }
  }
}
