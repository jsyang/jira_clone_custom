import { createConnection, Connection } from 'typeorm';

import * as entities from 'entities';

const createDatabaseConnection = (): Promise<Connection> =>
  createConnection({
    type: 'sqlite',
    database: `jira.sqlite`,
    entities: Object.values(entities),
    synchronize: true,
  });

export default createDatabaseConnection;
