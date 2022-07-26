import { ConfigParams } from 'pip-services3-commons-nodex';

import { CreditCardsPayPalPersistence } from '../../src/persistence/CreditCardsPayPalPersistence';
import { CreditCardsPersistenceFixture } from './CreditCardsPersistenceFixture';

suite('CreditCardsPayPalPersistence', ()=> {
    var PAYPAL_ACCESS_ID = process.env["PAYPAL_ACCESS_ID"] || "";
    var PAYPAL_ACCESS_KEY = process.env["PAYPAL_ACCESS_KEY"] || "";

    if (!PAYPAL_ACCESS_ID || !PAYPAL_ACCESS_KEY)
        return;

    var config = ConfigParams.fromTuples(
        'credential.access_id', PAYPAL_ACCESS_ID,
        'credential.access_key', PAYPAL_ACCESS_KEY,
        'options.sandbox', true
    );

    let persistence: CreditCardsPayPalPersistence;
    let fixture: CreditCardsPersistenceFixture;
    
    suiteSetup(async () => {
        persistence = new CreditCardsPayPalPersistence();
        persistence.configure(config);
        
        fixture = new CreditCardsPersistenceFixture(persistence);
        
        await persistence.open(null);
    });
    
    suiteTeardown(async () => {
        await persistence.close(null);
    });

    setup(async () => {
        await persistence.clear(null);
    });
        
    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

    test('Get with Filters', async () => {
        await fixture.testGetWithFilter();
    });

});