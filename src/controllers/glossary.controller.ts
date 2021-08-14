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
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody
} from '@loopback/rest';
import {Glossary} from '../models';
import {GlossaryRepository} from '../repositories';

export class GlossaryController {
  constructor(
    @repository(GlossaryRepository)
    public glossaryRepository : GlossaryRepository,
  ) {}

  @post('/glossaries', {
    responses: {
      '200': {
        description: 'Glossary model instance',
        content: {'application/json': {schema: getModelSchemaRef(Glossary)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Glossary, {
            title: 'NewGlossary',
            exclude: ['id'],
          }),
        },
      },
    })
    glossary: Omit<Glossary, 'id'>,
  ): Promise<Glossary> {
    return this.glossaryRepository.create(glossary);
  }

  @get('/glossaries/count', {
    responses: {
      '200': {
        description: 'Glossary model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Glossary) where?: Where<Glossary>,
  ): Promise<Count> {
    return this.glossaryRepository.count(where);
  }

  @get('/glossaries', {
    responses: {
      '200': {
        description: 'Array of Glossary model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Glossary, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Glossary) filter?: Filter<Glossary>,
  ): Promise<Glossary[]> {
    return this.glossaryRepository.find(filter);
  }

  @patch('/glossaries', {
    responses: {
      '200': {
        description: 'Glossary PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Glossary, {partial: true}),
        },
      },
    })
    glossary: Glossary,
    @param.where(Glossary) where?: Where<Glossary>,
  ): Promise<Count> {
    return this.glossaryRepository.updateAll(glossary, where);
  }

  @get('/glossaries/{id}', {
    responses: {
      '200': {
        description: 'Glossary model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Glossary, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Glossary, {exclude: 'where'}) filter?: FilterExcludingWhere<Glossary>
  ): Promise<Glossary> {
    return this.glossaryRepository.findById(id, filter);
  }

  @patch('/glossaries/{id}', {
    responses: {
      '204': {
        description: 'Glossary PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Glossary, {partial: true}),
        },
      },
    })
    glossary: Glossary,
  ): Promise<void> {
    await this.glossaryRepository.updateById(id, glossary);
  }

  @put('/glossaries/{id}', {
    responses: {
      '204': {
        description: 'Glossary PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() glossary: Glossary,
  ): Promise<void> {
    await this.glossaryRepository.replaceById(id, glossary);
  }

  @del('/glossaries/{id}', {
    responses: {
      '204': {
        description: 'Glossary DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.glossaryRepository.deleteById(id);
  }
}
