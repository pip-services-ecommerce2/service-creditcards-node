import { CreditCardsFilePersistence } from '../../src/persistence/CreditCardsFilePersistence';
import { CreditCardsPersistenceFixture } from './CreditCardsPersistenceFixture';

suite('CreditCardsFilePersistence', ()=> {
    let persistence: CreditCardsFilePersistence;
    let fixture: CreditCardsPersistenceFixture;
    
    setup(async () => {
        persistence = new CreditCardsFilePersistence('./data/credit_cards.test.json');

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