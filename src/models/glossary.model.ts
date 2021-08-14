import {Entity, hasMany, model, property} from '@loopback/repository';
import {GlossaryItem} from './glossary-item.model';

@model()
export class Glossary extends Entity {
  @property({type: 'string', id: true, generated: true}) id?: string;

  @property({type: 'date'}) createdAt?: string;

  @property({type: 'string'}) userId?: string;

  @property({type: 'string'}) code?: string;

  @property({type: 'string'}) name?: string;

  @property({type: 'string'}) description?: string;

  @property({type: 'string'}) catalogCodeDep?: string;

  @hasMany(() => GlossaryItem)
  glossaryItems: GlossaryItem[];

  constructor(data?: Partial<Glossary>) {
    super(data);
  }
}

export interface GlossaryRelations {
  // describe navigational properties here
}

export type GlossaryWithRelations = Glossary & GlossaryRelations;
