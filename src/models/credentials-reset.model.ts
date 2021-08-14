import {Model, model, property} from '@loopback/repository';

@model()
export class CredentialsReset extends Model {

  @property({ type: 'string', required: true,}) email: string;

  @property({ type: 'string', required: true,}) type?: string;

  constructor(data?: Partial<CredentialsReset>) {
    super(data);
  }
}

export interface CredentialsResetRelations {
  // describe navigational properties here
}

export type CredentialsResetWithRelations = CredentialsReset & CredentialsResetRelations;
