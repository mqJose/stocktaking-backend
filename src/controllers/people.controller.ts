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
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {EncryptDecryptKey as key} from '../keys/encrypt-decrypt.key';
import {StPerson} from '../models';
import {StPersonRepository, UserRepository} from '../repositories';
import {EncryptDecrypt} from '../services/encrypt-decrypt.service';

export class People {
  constructor(
    @repository(StPersonRepository)
    public stPersonRepository : StPersonRepository,
    @repository(UserRepository)
    public userRepository : UserRepository,
  ) {}

  @post('/people')
  @response(200, {
    description: 'StPerson model instance',
    content: {'application/json': {schema: getModelSchemaRef(StPerson)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StPerson, {
            title: 'NewStPerson',
            exclude: ['id'],
          }),
        },
      },
    })
    stPerson: Omit<StPerson, 'id'>,
  ): Promise<StPerson> {
    const person = await this.stPersonRepository.create(stPerson);
    const password = new EncryptDecrypt(key.MD5).encrypt(
      new EncryptDecrypt(key.MD5).encrypt(person.password)
    );
    const userObject = {
      email: person.email,
      password,
      role: "1",
      stPersonId: person.id,
      createdBy: person.id
    };
    const user = await this.userRepository.create(userObject);
    user.password = '';
    person.user = user;
    return person;
  }

  @get('/people/count')
  @response(200, {
    description: 'StPerson model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(StPerson) where?: Where<StPerson>,
  ): Promise<Count> {
    return this.stPersonRepository.count(where);
  }

  @get('/people')
  @response(200, {
    description: 'Array of StPerson model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(StPerson, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(StPerson) filter?: Filter<StPerson>,
  ): Promise<StPerson[]> {
    return this.stPersonRepository.find(filter);
  }

  @patch('/people')
  @response(200, {
    description: 'StPerson PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StPerson, {partial: true}),
        },
      },
    })
    stPerson: StPerson,
    @param.where(StPerson) where?: Where<StPerson>,
  ): Promise<Count> {
    return this.stPersonRepository.updateAll(stPerson, where);
  }

  @get('/people/{id}')
  @response(200, {
    description: 'StPerson model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(StPerson, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(StPerson, {exclude: 'where'}) filter?: FilterExcludingWhere<StPerson>
  ): Promise<StPerson> {
    return this.stPersonRepository.findById(id, filter);
  }

  @patch('/people/{id}')
  @response(204, {
    description: 'StPerson PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StPerson, {partial: true}),
        },
      },
    })
    stPerson: StPerson,
  ): Promise<void> {
    await this.stPersonRepository.updateById(id, stPerson);
  }

  @put('/people/{id}')
  @response(204, {
    description: 'StPerson PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() stPerson: StPerson,
  ): Promise<void> {
    const user = await this.userRepository.findOne({where: {stPersonId: stPerson.id} });
    if (user) {
      user.email = stPerson.email;
      await this.userRepository.replaceById(user.id, user);
    }
    await this.stPersonRepository.replaceById(id, stPerson);
  }

  @del('/people/{id}')
  @response(204, {
    description: 'StPerson DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.stPersonRepository.deleteById(id);
  }
}
