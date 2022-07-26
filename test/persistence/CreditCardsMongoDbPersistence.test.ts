import { ConfigParams } from 'pip-services3-commons-nodex';

import { CreditCardsMongoDbPersistence } from '../../src/persistence/CreditCardsMongoDbPersistence';
import { CreditCardsPersistenceFixture } from './CreditCardsPersistenceFixture';

suite('CreditCardsMongoDbPersistence', ()=> {
    let persistence: CreditCardsMongoDbPersistence;
    let fixture: CreditCardsPersistenceFixture;

    setup(async () => {
        let MONGO_DB = process.env["MONGO_DB"] || "test";
        let MONGO_COLLECTION = process.env["MONGO_COLLECTION"] || "credit_cards";
        let MONGO_SERVICE_HOST = process.env["MONGO_SERVICE_HOST"] || "localhost";
        let MONGO_SERVICE_PORT = process.env["MONGO_SERVICE_PORT"] || "27017";
        let MONGO_SERVICE_URI = process.env["MONGO_SERVICE_URI"];

        let dbConfig = ConfigParams.fromTuples(
            "collection", MONGO_COLLECTION,
            "connection.database", MONGO_DB,
            "connection.host", MONGO_SERVICE_HOST,
            "connection.port", MONGO_SERVICE_PORT,
            "connection.uri", MONGO_SERVICE_URI
        );

        persistence = new CreditCardsMongoDbPersistence();
        persistence.configure(dbConfig);

        fixture = new CreditCardsPersistenceFixture(persistence);

        await persistence.open(null);
        await persistence.clear(null);
    });
    
    teardown(async () => {
        await persistence.close(null);
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

    test('Get with Filters', async () => {
        await fixture.testGetWithFilter();
    });

});