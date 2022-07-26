import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IOpenable } from 'pip-services3-commons-nodex';
import { ICleanable } from 'pip-services3-commons-nodex';
import { CredentialParams } from 'pip-services3-components-nodex';
import { CredentialResolver } from 'pip-services3-components-nodex';
import { CompositeLogger } from 'pip-services3-components-nodex';

import { BadRequestException } from 'pip-services3-commons-nodex';

import { CreditCardV1 } from '../data/version1/CreditCardV1';
import { ICreditCardsPersistence } from './ICreditCardsPersistence'
import { resolve } from 'path';
import { rejects } from 'assert';

export class CreditCardsPayPalPersistence implements ICreditCardsPersistence, IConfigurable,
    IReferenceable, IOpenable, ICleanable {

    private _sandbox: boolean = false;
    private _credentialsResolver: CredentialResolver = new CredentialResolver();
    private _logger: CompositeLogger = new CompositeLogger();
    private _client: any = null;

    public constructor() { }

    public configure(config: ConfigParams): void {
        this._logger.configure(config);
        this._credentialsResolver.configure(config);

        this._sandbox = config.getAsBooleanWithDefault("options.sandbox", this._sandbox);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._credentialsResolver.setReferences(references);
    }

    public isOpen(): boolean {
        return this._client != null;
    }

    public async open(correlationId: string): Promise<void> {
        let credentials: CredentialParams;

        // Get credential params
        credentials = await this._credentialsResolver.lookup(correlationId);

        // Connect
        this._client = require('paypal-rest-sdk');
        this._client.configure({
            mode: this._sandbox ? 'sandbox' : 'live',
            client_id: credentials.getAccessId(),
            client_secret: credentials.getAccessKey()
        });
    }

    public async close(correlationId: string): Promise<void> {
        this._client = null;
    }

    private toPublic(value: any): CreditCardV1 {
        if (value == null) return null;

        let result = this.omit(value, ['external_customer_id', 'external_card_id',
            'external_card_id', 'valid_until', 'create_time', 'update_time', 'links']);

        // Parse external_card_id
        let temp = value.external_card_id.split(';');
        result.number = temp.length > 0 ? temp[0] : '';
        result.name = temp.length > 1 ? temp[1] : '';
        result.ccv = temp.length > 2 ? temp[2] : '';
        result.saved = temp.length > 3 ? temp[3] == 'saved' : false;
        result.default = temp.length > 4 ? temp[4] == 'default' : false;
        result.customer_id = temp.length > 5 ? temp[5] : value.external_customer_id;
        return result;
    }

    private fromPublic(value: CreditCardV1): any {
        if (value == null) return null;

        delete value.create_time;
        delete value.update_time;

        let result = this.omit(value, ['id', 'state', 'customer_id', 'ccv', 'name', 'saved', 'default']);
        result.external_customer_id = value.customer_id;

        // Generate external_card_id
        let temp = value.number;
        temp += ';' + (value.name ? value.name.replace(';', '_') : '');
        temp += ';' + (value.ccv ? value.ccv.replace(';', '') : '');
        temp += ';' + (value.saved ? 'saved' : '');
        temp += ';' + (value.default ? 'default' : '');
        temp += ';' + (value.customer_id ? value.customer_id.replace(';', '') : '');
        result.external_card_id = temp;

        return result;
    }

    public async getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<CreditCardV1>> {
        let id = filter.getAsNullableString('id');
        let state = filter.getAsNullableString('state');
        let customerId = filter.getAsNullableString('customer_id');
        let saved = filter.getAsNullableBoolean('saved');
        let ids = filter.getAsObject('ids');

        // Process ids filter
        if (typeof ids === 'string')
            ids = ids.split(',');
        if (!Array.isArray(ids))
            ids = null;

        let skip = paging.getSkip(0);
        let take = paging.getTake(100);
        let items: CreditCardV1[] = [];

        let page = 0;
        let pageSize = 20;
        let pageItems: CreditCardV1[];

        do {
            page++;

            // Set filters supported by PayPal
            let options: any = {
                page: page,
                page_size: pageSize
            };
            if (customerId)
                options.external_customer_id = customerId;
            
            let data: any = await new Promise((resolve, rejects) => {
                this._client.creditCard.list(options, (err, data) => {
                    if (err) rejects(err);
                    resolve(data);
                });
            });
            

            pageItems = data.items.map(item => this.toPublic(item));

            for (let item of pageItems) {
                // Filter items
                if (id != null && item.id != id)
                    continue;
                if (state != null && item.state != state)
                    continue;
                if (saved != null && item.saved != saved)
                    continue;
                if (ids != null && ids.indexOf(item.id) < 0)
                    continue;

                // Process skip and take
                if (skip > 0) {
                    skip--;
                    continue;
                }

                if (items.length < take)
                    items.push(item);
            }
            
        } while (pageItems.length == pageSize && items.length < take)

        return new DataPage(items);
    }

    public async getOneById(correlationId: string, id: string): Promise<CreditCardV1> {
        let data = await new Promise((resolve, rejects) => {
            this._client.creditCard.get(id, (err, data) => {
                if (err != null && err.httpStatusCode == 404)
                    err = null;

                if (err != null) rejects(err);

                resolve(data);
            });
        });

        let item = this.toPublic(data);
        
        return item;
    }

    public async create(correlationId: string, item: CreditCardV1): Promise<CreditCardV1> {
        item = this.omit(item, ['id']);
        item = this.fromPublic(item);

        return await new Promise((resolve, rejects) => {
            this._client.creditCard.create(item, (err, data) => {
                console.log("Creating card", item);

                if (err != null) {
                    var strErr = JSON.stringify(err);
                    this._logger.trace(correlationId, "Error creating credit card with PayPal persistence: ", strErr);

                    let code = err && err.response ? err.response.name : "UNKNOWN";
                    let message = err && err.response ? err.response.message : strErr;
                    let status = err && err.httpStatusCode ? err.httpStatusCode : "500";

                    err = new BadRequestException(
                        null, code,
                        message
                    ).withStatus(status);

                    rejects(err);
                }

                item = this.toPublic(data);
                resolve(item);
            });
        });
    }

    public async update(correlationId: string, item: CreditCardV1): Promise<CreditCardV1> {
        let id = item.id;
        let data: any = this.fromPublic(item);

        // Delete and then recreate, because some fields are read-only in PayPal
        // this._client.creditCard.del(id, (err) => {
        //     if (err) {
        //         callback(err, null);
        //         return;
        //     }

        //     this._client.creditCard.create(data, (err, data) => {
        //         item = this.toPublic(data);
        //         callback(err, item);
        //     });
        // });

        // First try to create then delete, because if user misstyped credit card will be just deleted
        data = await new Promise((resolve, rejects) => {
            this._client.creditCard.create(data, (err, data) => {
                if (err) rejects(err);
                resolve(data);
            });
        });

        await new Promise((resolve, rejects) => {
            this._client.creditCard.del(id, (err) => {
                if (err) rejects(err);
                resolve(null);
            });
        });
        
        item = this.toPublic(data);

        return item;
        
    }

    public async deleteById(correlationId: string, id: string): Promise<CreditCardV1> {
        let data = await new Promise((resolve, rejects) => {
            this._client.creditCard.get(id, (err, data) => {
                if (err != null || data == null) {
                    rejects(err);
                }
            });
        });

        let item = this.toPublic(data);

        await new Promise((resolve, rejects) => {
            this._client.creditCard.del(id, (err) => {
                if (err != null) rejects(err);
                resolve(null);
            });
        });

        return item;
    }

    public async clear(correlationId: string): Promise<void> {
        let page = 0;
        let pageSize = 20;
        let creditCards: any[] = []

        do {
            page++;

            let options = {
                page_size: pageSize,
                page: page
            };

            let dataPage: any = await new Promise((resolve, rejects) => {
                this._client.creditCard.list(options, (err, dataPage) => {
                    if (err) rejects(err);
                    resolve(dataPage);
                });
            });

            creditCards = dataPage.items;

            for (let creditCard of creditCards) {
                await new Promise((resolve, rejects) => {
                    this._client.creditCard.del(creditCard.id, (err) => {
                        if (err != null) rejects(err);
                        resolve(null);
                    });
                });
            }

        } while (creditCards.length == pageSize)

    }

    private omit(obj: any, props: any[]): any {
        obj = { ...obj }
        props.forEach(prop => delete obj[prop])
        return obj
    }
}