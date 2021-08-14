import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Glossary, GlossaryRelations, GlossaryItem} from '../models';
import {MongodbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {GlossaryItemRepository} from './glossary-item.repository';

export class GlossaryRepository extends DefaultCrudRepository<
  Glossary,
  typeof Glossary.prototype.id,
  GlossaryRelations
> {

  public readonly glossaryItems: HasManyRepositoryFactory<GlossaryItem, typeof Glossary.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('GlossaryItemRepository') protected glossaryItemRepositoryGetter: Getter<GlossaryItemRepository>,
  ) {
    super(Glossary, dataSource);
    this.glossaryItems = this.createHasManyRepositoryFactoryFor('glossaryItems', glossaryItemRepositoryGetter,);
    this.registerInclusionResolver('glossaryItems', this.glossaryItems.inclusionResolver);
  }
}
