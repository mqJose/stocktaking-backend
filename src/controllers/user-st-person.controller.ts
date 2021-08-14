import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  StPerson, User
} from '../models';
import {UserRepository} from '../repositories';

export class UserPerson {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/users/{id}/person', {
    responses: {
      '200': {
        description: 'StPerson belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(StPerson)},
          },
        },
      },
    },
  })
  async getStPerson(
    @param.path.string('id') id: typeof User.prototype.id,
  ): Promise<StPerson> {
    return this.userRepository.stPerson(id);
  }
}
