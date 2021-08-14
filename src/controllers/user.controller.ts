import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef,
  HttpErrors, param,
  patch, post,
  put,
  requestBody
} from '@loopback/rest';
import {ks} from '../keys/config-file';
import {SystemMessage as msg} from '../messages/system.message';
import {CredentialsReset, EmailNotification, SmsNotification, User} from '../models';
import {Credentials} from '../models/credentials.model';
import {StPersonRepository, UserRepository} from '../repositories';
import {AuthService} from '../services/auth.service';
import {FunctionsService} from '../services/functions.service';
import {NotificationService} from '../services/notification.service';
import {NotificationsService} from '../services/notifications.service';

export class UserController {

  public authService: AuthService;

  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @repository(StPersonRepository)
    public stPersonRepository : StPersonRepository,
    @service(FunctionsService)
    public functionsService: FunctionsService,
    @service(NotificationsService)
    public notificationsService: NotificationsService,
  ) {
    this.authService = new AuthService(this.userRepository);
  }

  @post('/authorization', {
    responses: {
      '200': {
        description: 'Login for Users'
      },
    },
  })
  async authorization(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credentials),
        },
      },
    }) credentials: Credentials
  ): Promise<object> {
    const user = await this.authService.identify(
        credentials.email,
        credentials.password
      );
    if(user) {
      const token = await this.authService.generateToken(user);
      return {
        data: user,
        token
      }
    } else {
      throw new HttpErrors[401](msg.USER_PASS_INVALID);
    }

  }

  @post('/authorization-reset', {
    responses: {
      '200': {
        description: 'Reset for Users'
      },
    },
  })
  async reset(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CredentialsReset),
        },
      },
    }) dataReset: CredentialsReset
  ): Promise<string | boolean> {
    const randomPassword = await this.authService.resetPassword(dataReset.email);
    if (randomPassword){
      const person = await this.stPersonRepository.findOne({where: { email: dataReset.email }});
        if(dataReset.type === "sms") {
          if(person) {
            const notification = new SmsNotification({
              body: `Su nueva contraseña es: ${randomPassword}`,
              to: person.phone
            });
            const smsNotification = await new NotificationService().smsNotification(notification);
            console.log('>>> smsNotification', smsNotification, person.phone);
            if (smsNotification) {
              console.log("sms message sent");
              return "OK"
            }
            throw new HttpErrors[400]("Phone is not found");
          }
          throw new HttpErrors[400]("Person not found");
          }
        else if(dataReset.type === "email") {
          if (person) {
            const notification = new EmailNotification({
              textBody: `Su nueva contraseña es: ${randomPassword}`,
              htmlBody: `Su nueva contraseña es: ${randomPassword}`,
              to: person.email,
              subject: 'New Password'
            });
            const mail = await new NotificationService().mailNotification(notification);
            if (mail) {
              console.log("mail message sent");
              return "OK"
            }
            throw new HttpErrors[400]("Email is not found");
          }
          throw new HttpErrors[400]("User not found");
        }
        throw new HttpErrors[400]("This notification type is not supported.");
    }
    throw new HttpErrors[400]("Email not found");
  }

  @post('/recover-account-email', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {
          schema: {
            send: "OK"
          }
        }},
      },
    },
  })
  async recoverAccountByEmail(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CredentialsReset, {
            title: 'RecoverAccountByEmail',
            exclude: ['type'],
          }),
        },
      },
    })
    credentialsReset: CredentialsReset,
  ): Promise<Object> {
    const person = await this.stPersonRepository.findOne({where: {email: credentialsReset.email}})
    if (!person) {
      throw new HttpErrors[401]("Este usuario no existe");
    }
    const randomKey = this.functionsService.generateRandomKey();
    const newKey = this.functionsService.cryptTextMD5(randomKey);
    person.password = newKey;
    await this.stPersonRepository.update(person);
    const content = `Hola, sus datos son: Usuario: ${person.nickname} y Contraseña: ${randomKey}.`;
    this.notificationsService.sendNotificationByEmail(person.email, ks.subjectEmail, content);
    return {
      send: "OK"
    };
  }

  @post('/recover-account-sms', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {
          schema: {
            send: "OK"
          }
        }},
      },
    },
  })
  async recoverAccountBySms(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CredentialsReset, {
            title: 'RecoverAccountByEmail',
            exclude: ['type'],
          }),
        },
      },
    })
    credentialsReset: CredentialsReset,
  ): Promise<Object> {
    const person = await this.stPersonRepository.findOne({where: {email: credentialsReset.email}})
    if (!person) {
      throw new HttpErrors[401]("Este usuario no existe");
    }
    const randomKey = this.functionsService.generateRandomKey();
    const newKey = this.functionsService.cryptTextMD5(randomKey);
    person.password = newKey;
    await this.stPersonRepository.update(person);
    const content = `Hola, sus datos son: Usuario: ${person.nickname} y Contraseña: ${randomKey}.`;
    this.notificationsService.sendNotificationBySms(person.phone, content);
    return {
      send: "OK"
    };
  }

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
