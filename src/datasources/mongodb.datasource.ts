import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongodb',
  connector: 'mongodb',
  url: process.env.DB_URL ? process.env.DB_URL :   'mongodb://localhost:27017/stocktaking_db',
  host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  port: 27017,
  user: process.env.DB_USER? process.env.DB_USER : '',
  password: process.env.DB_PASSWORD? process.env.DB_PASSWORD : '',
  database: process.env.DB_DATABASE? process.env.DB_DATABASE : 'stocktaking_db',
  useNewUrlParser: true,
};
console.log(config);
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongodb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongodb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
