import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Glossary} from './glossary.model';

@model()
export class GlossaryItem extends Entity {
  @property({type: 'string', id: true, generated: true}) id?: string;

  @property({type: 'date'}) createdAt?: string;

  @property({type: 'string'}) userId?: string;

  @property({type: 'string'}) value?: string;

  @property({type: 'string'}) label?: string;

  @property({type: 'string'}) lang?: string;

  @property({type: 'string'}) glossaryCode?: string;

  @property({type: 'string'}) glossaryCodeDep?: string;

  @property({type: 'string'}) glossaryIdDep?: string;

  @property({type: 'string'}) description?: string;

  @property({type: 'string'}) icon?: string;

  @property({type: 'string'}) image?: string;

  @property({type: 'string'}) css?: string;

  @property({type: 'string'}) bold?: string;

  @property({type: 'string'}) italic?: string;

  @property({type: 'string'}) status?: string;

  @belongsTo(() => Glossary)
  glossaryId: string;

  constructor(data?: Partial<GlossaryItem>) {
    super(data);
  }
}

export interface GlossaryItemRelations {

  // describe navigational properties here
}

export type GlossaryItemWithRelations = GlossaryItem & GlossaryItemRelations;
