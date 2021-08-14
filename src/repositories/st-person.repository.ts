import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {StPerson, StPersonRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class StPersonRepository extends DefaultCrudRepository<
  StPerson,
  typeof StPerson.prototype.id,
  StPersonRelations
> {
  public readonly user: HasOneRepositoryFactory<User, typeof StPerson.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(StPerson, dataSource);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
