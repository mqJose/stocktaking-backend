import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Glossary, GlossaryItem
} from '../models';
import {GlossaryItemRepository} from '../repositories';

export class GlossaryItemGlossary {
  constructor(
    @repository(GlossaryItemRepository)
    public glossaryItemRepository: GlossaryItemRepository,
  ) { }

  @get('/glossary-items/{id}/glossary', {
    responses: {
      '200': {
        description: 'Glossary belonging to GlossaryItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Glossary)},
          },
        },
      },
    },
  })
  async getGlossary(
    @param.path.string('id') id: typeof GlossaryItem.prototype.id,
  ): Promise<Glossary> {
    return this.glossaryItemRepository.glossary(id);
  }
}
