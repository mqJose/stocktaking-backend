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
import {GlossaryItem} from '../models';
import {GlossaryItemRepository} from '../repositories';

export class GlossaryItemController {
  constructor(
    @repository(GlossaryItemRepository)
    public glossaryItemRepository : GlossaryItemRepository,
  ) {}

  @post('/glossary-items', {
    responses: {
      '200': {
        description: 'GlossaryItem model instance',
        content: {'application/json': {schema: getModelSchemaRef(GlossaryItem)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlossaryItem, {
            title: 'NewGlossaryItem',
            exclude: ['id'],
          }),
        },
      },
    })
    glossaryItem: Omit<GlossaryItem, 'id'>,
  ): Promise<GlossaryItem> {
    return this.glossaryItemRepository.create(glossaryItem);
  }

  @get('/glossary-items/count', {
    responses: {
      '200': {
        description: 'GlossaryItem model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(GlossaryItem) where?: Where<GlossaryItem>,
  ): Promise<Count> {
    return this.glossaryItemRepository.count(where);
  }

  @get('/glossary-items', {
    responses: {
      '200': {
        description: 'Array of GlossaryItem model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(GlossaryItem, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(GlossaryItem) filter?: Filter<GlossaryItem>,
  ): Promise<GlossaryItem[]> {
    return this.glossaryItemRepository.find(filter);
  }

  @patch('/glossary-items', {
    responses: {
      '200': {
        description: 'GlossaryItem PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlossaryItem, {partial: true}),
        },
      },
    })
    glossaryItem: GlossaryItem,
    @param.where(GlossaryItem) where?: Where<GlossaryItem>,
  ): Promise<Count> {
    return this.glossaryItemRepository.updateAll(glossaryItem, where);
  }

  @get('/glossary-items/{id}', {
    responses: {
      '200': {
        description: 'GlossaryItem model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(GlossaryItem, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(GlossaryItem, {exclude: 'where'}) filter?: FilterExcludingWhere<GlossaryItem>
  ): Promise<GlossaryItem> {
    return this.glossaryItemRepository.findById(id, filter);
  }

  @patch('/glossary-items/{id}', {
    responses: {
      '204': {
        description: 'GlossaryItem PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlossaryItem, {partial: true}),
        },
      },
    })
    glossaryItem: GlossaryItem,
  ): Promise<void> {
    await this.glossaryItemRepository.updateById(id, glossaryItem);
  }

  @put('/glossary-items/{id}', {
    responses: {
      '204': {
        description: 'GlossaryItem PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() glossaryItem: GlossaryItem,
  ): Promise<void> {
    await this.glossaryItemRepository.replaceById(id, glossaryItem);
  }

  @del('/glossary-items/{id}', {
    responses: {
      '204': {
        description: 'GlossaryItem DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.glossaryItemRepository.deleteById(id);
  }
}
