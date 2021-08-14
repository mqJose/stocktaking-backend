import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {StPerson, User} from '../models';
import {StPersonRepository} from '../repositories';

export class PersonUser {
  constructor(
    @repository(StPersonRepository) protected stPersonRepository: StPersonRepository,
  ) { }

  @get('/people/{id}/user', {
    responses: {
      '200': {
        description: 'StPerson has one User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User> {
    return this.stPersonRepository.user(id).get(filter);
  }

  @post('/people/{id}/user', {
    responses: {
      '200': {
        description: 'StPerson model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof StPerson.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInStPerson',
            exclude: ['id'],
            optional: ['stPersonId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.stPersonRepository.user(id).create(user);
  }

  @patch('/people/{id}/user', {
    responses: {
      '200': {
        description: 'StPerson.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.stPersonRepository.user(id).patch(user, where);
  }

  @del('/people/{id}/user', {
    responses: {
      '200': {
        description: 'StPerson.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.stPersonRepository.user(id).delete(where);
  }
}
