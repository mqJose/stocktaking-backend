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
import {
  Glossary,
  GlossaryItem
} from '../models';
import {GlossaryRepository} from '../repositories';

export class GlossaryGlossaryItem {
  constructor(
    @repository(GlossaryRepository) protected glossaryRepository: GlossaryRepository,
  ) { }

  @get('/glossaries/{id}/glossary-items', {
    responses: {
      '200': {
        description: 'Array of Glossary has many GlossaryItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(GlossaryItem)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<GlossaryItem>,
  ): Promise<GlossaryItem[]> {
    return this.glossaryRepository.glossaryItems(id).find(filter);
  }

  @post('/glossaries/{id}/glossary-items', {
    responses: {
      '200': {
        description: 'Glossary model instance',
        content: {'application/json': {schema: getModelSchemaRef(GlossaryItem)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Glossary.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlossaryItem, {
            title: 'NewGlossaryItemInGlossary',
            exclude: ['id'],
            optional: ['glossaryId']
          }),
        },
      },
    }) glossaryItem: Omit<GlossaryItem, 'id'>,
  ): Promise<GlossaryItem> {
    return this.glossaryRepository.glossaryItems(id).create(glossaryItem);
  }

  @patch('/glossaries/{id}/glossary-items', {
    responses: {
      '200': {
        description: 'Glossary.GlossaryItem PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlossaryItem, {partial: true}),
        },
      },
    })
    glossaryItem: Partial<GlossaryItem>,
    @param.query.object('where', getWhereSchemaFor(GlossaryItem)) where?: Where<GlossaryItem>,
  ): Promise<Count> {
    return this.glossaryRepository.glossaryItems(id).patch(glossaryItem, where);
  }

  @del('/glossaries/{id}/glossary-items', {
    responses: {
      '200': {
        description: 'Glossary.GlossaryItem DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(GlossaryItem)) where?: Where<GlossaryItem>,
  ): Promise<Count> {
    return this.glossaryRepository.glossaryItems(id).delete(where);
  }
}
