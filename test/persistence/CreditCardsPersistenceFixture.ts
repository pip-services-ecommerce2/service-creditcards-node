const assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { CreditCardV1 } from '../../src/data/version1/CreditCardV1';
import { CreditCardTypeV1 } from '../../src/data/version1/CreditCardTypeV1';
import { CreditCardStateV1 } from '../../src/data/version1/CreditCardStateV1';

import { ICreditCardsPersistence } from '../../src/persistence/ICreditCardsPersistence';

let CREDIT_CARD1: CreditCardV1 = {
    id: '1',
    customer_id: '1',
    type: CreditCardTypeV1.Visa,
    number: '4032036094894795',
    expire_month: 1,
    expire_year: 2021,
    first_name: 'Bill',
    last_name: 'Gates',
    billing_address: {
        line1: '2345 Swan Rd',
        city: 'Tucson',
        state: 'AZ',
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
    number: '4032037578262780',
    expire_month: 4,
    expire_year: 2028,
    first_name: 'Joe',
    last_name: 'Dow',
    billing_address: {
        line1: '123 Broadway Blvd',
        city: 'New York',
        state: 'NY',
        postal_code: '123001',
        country_code: 'US'
    },
    name: 'Test Card 2',
    saved: true,
    default: false,
    state: CreditCardStateV1.Expired
};
let CREDIT_CARD3: CreditCardV1 = {
    id: '3',
    customer_id: '2',
    type: CreditCardTypeV1.Visa,
    number: '4032037578262780',
    expire_month: 5,
    expire_year: 2022,
    first_name: 'Steve',
    last_name: 'Jobs',
    billing_address: {
        line1: '234 6th Str',
        city: 'Los Angeles',
        state: 'CA',
        postal_code: '65320',
        country_code: 'US'
    },
    ccv: '124',
    name: 'Test Card 2',
    state: CreditCardStateV1.Ok
};

export class CreditCardsPersistenceFixture {
    private _persistence: ICreditCardsPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private async testCreateCreditCards() {
        // Create one credit card
        let creditCard = await this._persistence.create(null, CREDIT_CARD1);

        assert.isObject(creditCard);
        assert.equal(creditCard.first_name, CREDIT_CARD1.first_name);
        assert.equal(creditCard.last_name, CREDIT_CARD1.last_name);
        assert.equal(creditCard.expire_year, CREDIT_CARD1.expire_year);
        assert.equal(creditCard.customer_id, CREDIT_CARD1.customer_id);

        // Create another credit card
        creditCard = await this._persistence.create(null, CREDIT_CARD2);

        assert.isObject(creditCard);
        assert.equal(creditCard.first_name, CREDIT_CARD2.first_name);
        assert.equal(creditCard.last_name, CREDIT_CARD2.last_name);
        assert.equal(creditCard.expire_year, CREDIT_CARD2.expire_year);
        assert.equal(creditCard.customer_id, CREDIT_CARD2.customer_id);

        // Create yet another credit card
        creditCard = await this._persistence.create(null, CREDIT_CARD3);

        assert.isObject(creditCard);
        assert.equal(creditCard.first_name, CREDIT_CARD3.first_name);
        assert.equal(creditCard.last_name, CREDIT_CARD3.last_name);
        assert.equal(creditCard.expire_year, CREDIT_CARD3.expire_year);
        assert.equal(creditCard.customer_id, CREDIT_CARD3.customer_id);
    }
                
    public async testCrudOperations() {
        let creditCard1: CreditCardV1;

        // Create items
        await this.testCreateCreditCards();

        // Get all credit cards
        let page = await this._persistence.getPageByFilter(
            null,
            new FilterParams(),
            new PagingParams()
        );

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        creditCard1 = page.data[0];

        // Update the credit card
        creditCard1.name = 'Updated Card 1';

        let creditCard = await this._persistence.update(null, creditCard1);

        assert.isObject(creditCard);
        assert.equal(creditCard.name, 'Updated Card 1');
        // PayPal changes id on update
        //!!assert.equal(creditCard.id, creditCard1.id);

        creditCard1 = creditCard;

        // Delete credit card
        await this._persistence.deleteById(null, creditCard1.id);

        // Try to get delete credit card
        creditCard = await this._persistence.getOneById(null, creditCard1.id);

        assert.isNull(creditCard || null);
    }

    public async testGetWithFilter() {
        // Create credit cards
        await this.testCreateCreditCards();

        // Get credit cards filtered by customer id
        let page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromValue({
                customer_id: '1'
            }),
            new PagingParams()
        );

        assert.isObject(page);
        assert.lengthOf(page.data, 2);

        // Get credit cards by state
        page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromValue({
                state: 'ok'
            }),
            new PagingParams()
        );

        assert.isObject(page);
        // PayPal calculate states by itself
        //assert.lengthOf(page.data, 2);

        // Get credit cards by saved
        page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromValue({
                saved: true
            }),
            new PagingParams()
        );

        assert.isObject(page);
        assert.lengthOf(page.data, 2);

        // Get credit cards by ids
        page = await this._persistence.getPageByFilter(
            null,
            FilterParams.fromValue({
                ids: ['1', '3']
            }),
            new PagingParams()
        );

        assert.isObject(page);
        // PayPal manages ids by itself
        // assert.lengthOf(page.data, 2);
    }

}
