import {belongsTo, Entity, model, property} from '@loopback/repository';
import {StPerson} from './st-person.model';

@model()
export class User extends Entity {
  @property({type: 'string', id: true, generated: true}) id?: string;

  @property({type: 'string', required: true}) email: string;

  @property({type: 'string', required: true}) password?: string;

  @property({type: 'string', required: true}) role?: string;

  @property({type: 'string', required: true}) createdBy?: string;

  @property({type: 'date', default: () => new Date()}) createAt: Date;

  @belongsTo(() => StPerson) stPersonId: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
