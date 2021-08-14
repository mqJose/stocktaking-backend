import {Entity, hasOne, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class StPerson extends Entity {
  @property({type: 'string', id: true, generated: true}) id?: string;

  @property({type: 'string'}) nickname?: string;

  @property({type: 'string', required: true}) password: string;

  @property({type: 'string'}) firstName?: string;

  @property({type: 'string'}) secondName?: string;

  @property({type: 'string'}) lastName?: string;

  @property({type: 'string'}) surName?: string;

  @property({type: 'date'}) birthday?: string;

  @property({type: 'string'}) gender?: string;

  @property({type: 'string'}) email: string;

  @property({type: 'string'}) phone: string;

  @property({type: 'string'}) termsOfUse?: string;

  @property({type: 'string'}) ci?: string;

  @property({type: 'string'}) cityCi?: string; // ciudad del CI

  @property({type: 'string'}) value?: string; // valoracion rating

  @property({type: 'string'}) location?: string;

  @property({type: 'string'}) address?: string; // domicilio

  @property({type: 'string'}) photo?: string; // foto

  @property({type: 'string'}) createdBy?: string;

  @property({type: 'date', default: () => new Date()}) createAt: Date;

  // Relations

  @hasOne(() => User) user: User;


  constructor(data?: Partial<StPerson>) {
    super(data);
  }
}

export interface StPersonRelations {
  // describe navigational properties here
}

export type StPersonWithRelations = StPerson & StPersonRelations;
