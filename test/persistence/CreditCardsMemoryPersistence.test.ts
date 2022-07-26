import { ConfigParams } from 'pip-services3-commons-nodex';

import { CreditCardsMemoryPersistence } from '../../src/persistence/CreditCardsMemoryPersistence';
import { CreditCardsPersistenceFixture } from './CreditCardsPersistenceFixture';

suite('CreditCardsMemoryPersistence', ()=> {
    let persistence: CreditCardsMemoryPersistence;
    let fixture: CreditCardsPersistenceFixture;
    
    setup(async () => {
        persistence = new CreditCardsMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new CreditCardsPersistenceFixture(persistence);
        
        await persistence.open(null);
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