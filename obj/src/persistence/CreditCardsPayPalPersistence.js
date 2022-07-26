"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditCardsPayPalPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_components_nodex_2 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class CreditCardsPayPalPersistence {
    constructor() {
        this._sandbox = false;
        this._credentialsResolver = new pip_services3_components_nodex_1.CredentialResolver();
        this._logger = new pip_services3_components_nodex_2.CompositeLogger();
        this._client = null;
    }
    configure(config) {
        this._logger.configure(config);
        this._credentialsResolver.configure(config);
        this._sandbox = config.getAsBooleanWithDefault("options.sandbox", this._sandbox);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._credentialsResolver.setReferences(references);
    }
    isOpen() {
        return this._client != null;
    }
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let credentials;
            // Get credential params
            credentials = yield this._credentialsResolver.lookup(correlationId);
            // Connect
            this._client = require('paypal-rest-sdk');
            this._client.configure({
                mode: this._sandbox ? 'sandbox' : 'live',
                client_id: credentials.getAccessId(),
                client_secret: credentials.getAccessKey()
            });
        });
    }
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._client = null;
        });
    }
    toPublic(value) {
        if (value == null)
            return null;
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
    fromPublic(value) {
        if (value == null)
            return null;
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
    getPageByFilter(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
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
            let items = [];
            let page = 0;
            let pageSize = 20;
            let pageItems;
            do {
                page++;
                // Set filters supported by PayPal
                let options = {
                    page: page,
                    page_size: pageSize
                };
                if (customerId)
                    options.external_customer_id = customerId;
                let data = yield new Promise((resolve, rejects) => {
                    this._client.creditCard.list(options, (err, data) => {
                        if (err)
                            rejects(err);
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
            } while (pageItems.length == pageSize && items.length < take);
            return new pip_services3_commons_nodex_1.DataPage(items);
        });
    }
    getOneById(correlationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield new Promise((resolve, rejects) => {
                this._client.creditCard.get(id, (err, data) => {
                    if (err != null && err.httpStatusCode == 404)
                        err = null;
                    if (err != null)
                        rejects(err);
                    resolve(data);
                });
            });
            let item = this.toPublic(data);
            return item;
        });
    }
    create(correlationId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            item = this.omit(item, ['id']);
            item = this.fromPublic(item);
            return yield new Promise((resolve, rejects) => {
                this._client.creditCard.create(item, (err, data) => {
                    console.log("Creating card", item);
                    if (err != null) {
                        var strErr = JSON.stringify(err);
                        this._logger.trace(correlationId, "Error creating credit card with PayPal persistence: ", strErr);
                        let code = err && err.response ? err.response.name : "UNKNOWN";
                        let message = err && err.response ? err.response.message : strErr;
                        let status = err && err.httpStatusCode ? err.httpStatusCode : "500";
                        err = new pip_services3_commons_nodex_2.BadRequestException(null, code, message).withStatus(status);
                        rejects(err);
                    }
                    item = this.toPublic(data);
                    resolve(item);
                });
            });
        });
    }
    update(correlationId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = item.id;
            let data = this.fromPublic(item);
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
            data = yield new Promise((resolve, rejects) => {
                this._client.creditCard.create(data, (err, data) => {
                    if (err)
                        rejects(err);
                    resolve(data);
                });
            });
            yield new Promise((resolve, rejects) => {
                this._client.creditCard.del(id, (err) => {
                    if (err)
                        rejects(err);
                    resolve(null);
                });
            });
            item = this.toPublic(data);
            return item;
        });
    }
    deleteById(correlationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield new Promise((resolve, rejects) => {
                this._client.creditCard.get(id, (err, data) => {
                    if (err != null || data == null) {
                        rejects(err);
                    }
                });
            });
            let item = this.toPublic(data);
            yield new Promise((resolve, rejects) => {
                this._client.creditCard.del(id, (err) => {
                    if (err != null)
                        rejects(err);
                    resolve(null);
                });
            });
            return item;
        });
    }
    clear(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = 0;
            let pageSize = 20;
            let creditCards = [];
            do {
                page++;
                let options = {
                    page_size: pageSize,
                    page: page
                };
                let dataPage = yield new Promise((resolve, rejects) => {
                    this._client.creditCard.list(options, (err, dataPage) => {
                        if (err)
                            rejects(err);
                        resolve(dataPage);
                    });
                });
                creditCards = dataPage.items;
                for (let creditCard of creditCards) {
                    yield new Promise((resolve, rejects) => {
                        this._client.creditCard.del(creditCard.id, (err) => {
                            if (err != null)
                                rejects(err);
                            resolve(null);
                        });
                    });
                }
            } while (creditCards.length == pageSize);
        });
    }
    omit(obj, props) {
        obj = Object.assign({}, obj);
        props.forEach(prop => delete obj[prop]);
        return obj;
    }
}
exports.CreditCardsPayPalPersistence = CreditCardsPayPalPersistence;
//# sourceMappingURL=CreditCardsPayPalPersistence.js.map