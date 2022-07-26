const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';

import { CreditCardV1 } from '../../src/data/version1/CreditCardV1';
import { CreditCardTypeV1 } from '../../src/data/version1/CreditCardTypeV1';
import { CreditCardStateV1 } from '../../src/data/version1/CreditCardStateV1';
import { CreditCardsLambdaFunction } from '../../src/container/CreditCardsLambdaFunction';

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

suite('CreditCardsLambdaFunction', ()=> {
    let lambda: CreditCardsLambdaFunction;

    suiteSetup(async () => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'service-creditcards:persistence:memory:default:1.0',
            'controller.descriptor', 'service-creditcards:controller:default:default:1.0'
        );

        lambda = new CreditCardsLambdaFunction();
        lambda.configure(config);
        await lambda.open(null);
    });
    
    suiteTeardown(async () => {
        await lambda.close(null);
    });
    
    test('CRUD Operations', async () => {
        var creditCard1, creditCard2: CreditCardV1;

        // Create one credit card
        let creditCard = await lambda.act(
            {
                role: 'credit_cards',
                cmd: 'create_credit_card',
                card: CREDIT_CARD1
            }
        );

        assert.isObject(creditCard);
        assert.equal(creditCard.number, CREDIT_CARD1.number);
        assert.equal(creditCard.expire_year, CREDIT_CARD1.expire_year);
        assert.equal(creditCard.customer_id, CREDIT_CARD1.customer_id);

        creditCard1 = creditCard;

        // Create another credit card
        creditCard = await lambda.act(
            {
                role: 'credit_cards',
                cmd: 'create_credit_card',
                card: CREDIT_CARD2
            }
        );

        assert.isObject(creditCard);
        assert.equal(creditCard.number, CREDIT_CARD2.number);
        assert.equal(creditCard.expire_year, CREDIT_CARD2.expire_year);
        assert.equal(creditCard.customer_id, CREDIT_CARD2.customer_id);

        creditCard2 = creditCard;

        // Get all credit cards
        let page = await lambda.act(
            {
                role: 'credit_cards',
                cmd: 'get_credit_cards'
            }
        );

        assert.isObject(page);
        assert.lengthOf(page.data, 2);

        // Update the credit card
        creditCard1.name = 'Updated Card 1';

        creditCard = await lambda.act(
            {
                role: 'credit_cards',
                cmd: 'update_credit_card',
                card: creditCard1
            }
        );

        assert.isObject(creditCard);
        assert.equal(creditCard.name, 'Updated Card 1');
        assert.equal(creditCard.id, CREDIT_CARD1.id);

        creditCard1 = creditCard;

        // Delete credit card
        await lambda.act(
            {
                role: 'credit_cards',
                cmd: 'delete_credit_card_by_id',
                card_id: creditCard1.id,
                customer_id: creditCard1.customer_id
            }
        );

        // Try to get delete credit card
        creditCard = await lambda.act(
            {
                role: 'credit_cards',
                cmd: 'get_credit_card_by_id',
                card_id: creditCard1.id,
                customer_id: creditCard1.customer_id
            }
        );

        assert.isNull(creditCard || null);
    });
});