import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {StPerson, User, UserRelations} from '../models';
import {StPersonRepository} from './st-person.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly stPerson: BelongsToAccessor<StPerson, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('StPersonRepository') protected stPersonRepositoryGetter: Getter<StPersonRepository>,
  ) {
    super(User, dataSource);
    this.stPerson = this.createBelongsToAccessorFor('stPerson', stPersonRepositoryGetter,);
    this.registerInclusionResolver('stPerson', this.stPerson.inclusionResolver);
  }
}
