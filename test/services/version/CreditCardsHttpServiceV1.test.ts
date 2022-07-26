const restify = require('restify');
const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { CreditCardV1 } from '../../../src/data/version1/CreditCardV1';
import { CreditCardTypeV1 } from '../../../src/data/version1/CreditCardTypeV1';
import { CreditCardStateV1 } from '../../../src/data/version1/CreditCardStateV1';
import { CreditCardsMemoryPersistence } from '../../../src/persistence/CreditCardsMemoryPersistence';
import { CreditCardsController } from '../../../src/logic/CreditCardsController';
import { CreditCardsHttpServiceV1 } from '../../../src/services/version1/CreditCardsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let CREDIT_CARD1: CreditCardV1 = {
    id: '1',
    customer_id: '1',
    type: CreditCardTypeV1.Visa,
    number: '1111111111111111',
    expire_month: 1,
    expire_year: 2021,
    first_name: 'Bill',
    last_name: 'Gates',
    billing_address: {
        line1: '2345 Swan Rd',
        city: 'Tucson',
        postal_code: '85710',
        country_code: 'US'
    },
    ccv: '213',
    name: 'Test Card 1',
    saved: true,
    default: true,
    state: CreditCardStateV1.Ok
};
let CREDIT_CARD2: CreditCardV1 = {
    id: '2',
    customer_id: '1',
    type: CreditCardTypeV1.Visa,
    number: '2222222222222222',
    expire_month: 4,
    expire_year: 2028,
    first_name: 'Joe',
    last_name: 'Dow',
    billing_address: {
        line1: '123 Broadway Blvd',
        city: 'New York',
        postal_code: '123001',
        country_code: 'US'
    },
    name: 'Test Card 2',
    saved: true,
    default: false,
    state: CreditCardStateV1.Expired
};


suite('CreditCardsHttpServiceV1', ()=> {    
    let service: CreditCardsHttpServiceV1;
    let rest: any;

    suiteSetup(async () => {
        let persistence = new CreditCardsMemoryPersistence();
        let controller = new CreditCardsController();

        service = new CreditCardsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-creditcards', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-creditcards', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-creditcards', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });
    
    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', async () => {
        let creditCard1, creditCard2: CreditCardV1;

        // Create one credit card
        let creditCard = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/credit_cards/create_credit_card',
                {
                    card: CREDIT_CARD1
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(creditCard);
        assert.equal(creditCard.number, CREDIT_CARD1.number);
        assert.equal(creditCard.expire_year, CREDIT_CARD1.expire_year);
        assert.equal(creditCard.customer_id, CREDIT_CARD1.customer_id);

        creditCard1 = creditCard;

        // Create another credit card
        creditCard = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/credit_cards/create_credit_card',
                {
                    card: CREDIT_CARD2
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(creditCard);
        assert.equal(creditCard.number, CREDIT_CARD2.number);
        assert.equal(creditCard.expire_year, CREDIT_CARD2.expire_year);
        assert.equal(creditCard.customer_id, CREDIT_CARD2.customer_id);

        creditCard2 = creditCard;

        // Get all credit cards
        let page = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/credit_cards/get_credit_cards',
                {},
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(page);
        assert.lengthOf(page.data, 2);

        // Update the credit card
        creditCard1.name = 'Updated Card 1';

        creditCard = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/credit_cards/update_credit_card',
                {
                    card: creditCard1
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(creditCard);
        assert.equal(creditCard.name, 'Updated Card 1');
        assert.equal(creditCard.id, CREDIT_CARD1.id);

        creditCard1 = creditCard;

        // Delete credit card
        let result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/credit_cards/delete_credit_card_by_id',
                {
                    card_id: creditCard1.id,
                    customer_id: creditCard1.customer_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // assert.isNull(result);

        // Try to get delete credit card
        result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/credit_cards/get_credit_card_by_id',
                {
                    card_id: creditCard1.id,
                    customer_id: creditCard1.customer_id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // assert.isNull(result);
    });
});