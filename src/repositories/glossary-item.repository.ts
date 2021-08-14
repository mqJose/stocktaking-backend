import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {GlossaryItem, GlossaryItemRelations, Glossary} from '../models';
import {MongodbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {GlossaryRepository} from './glossary.repository';

export class GlossaryItemRepository extends DefaultCrudRepository<
  GlossaryItem,
  typeof GlossaryItem.prototype.id,
  GlossaryItemRelations
> {

  public readonly glossary: BelongsToAccessor<Glossary, typeof GlossaryItem.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('GlossaryRepository') protected glossaryRepositoryGetter: Getter<GlossaryRepository>,
  ) {
    super(GlossaryItem, dataSource);
    this.glossary = this.createBelongsToAccessorFor('glossary', glossaryRepositoryGetter,);
    this.registerInclusionResolver('glossary', this.glossary.inclusionResolver);
  }
}
