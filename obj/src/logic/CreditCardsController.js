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
exports.CreditCardsController = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const CreditCardStateV1_1 = require("../data/version1/CreditCardStateV1");
const CreditCardsCommandSet_1 = require("./CreditCardsCommandSet");
class CreditCardsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_nodex_2.DependencyResolver(CreditCardsController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new CreditCardsCommandSet_1.CreditCardsCommandSet(this);
        return this._commandSet;
    }
    getCreditCards(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._persistence.getPageByFilter(correlationId, filter, paging);
        });
    }
    getCreditCardById(correlationId, id, customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let card = yield this._persistence.getOneById(correlationId, id);
            // Do not allow to access card of different customer
            if (card && card.customer_id != customerId)
                card = null;
            return card;
        });
    }
    createCreditCard(correlationId, card) {
        return __awaiter(this, void 0, void 0, function* () {
            card.state = card.state || CreditCardStateV1_1.CreditCardStateV1.Ok;
            card.create_time = new Date();
            card.update_time = new Date();
            return yield this._persistence.create(correlationId, card);
        });
    }
    updateCreditCard(correlationId, card) {
        return __awaiter(this, void 0, void 0, function* () {
            let newCard;
            card.state = card.state || CreditCardStateV1_1.CreditCardStateV1.Ok;
            card.update_time = new Date();
            let data = yield this._persistence.getOneById(correlationId, card.id);
            if (data && data.customer_id != card.customer_id) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'WRONG_CUST_ID', 'Wrong credit card customer id')
                    .withDetails('id', card.id)
                    .withDetails('customer_id', card.customer_id);
            }
            newCard = yield this._persistence.update(correlationId, card);
            return newCard;
        });
    }
    deleteCreditCardById(correlationId, id, customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let oldCard;
            let data = yield this._persistence.getOneById(correlationId, id);
            if (data && data.customer_id != customerId) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'WRONG_CUST_ID', 'Wrong credit card customer id')
                    .withDetails('id', id)
                    .withDetails('customer_id', customerId);
            }
            oldCard = yield this._persistence.deleteById(correlationId, id);
            return oldCard;
        });
    }
}
exports.CreditCardsController = CreditCardsController;
CreditCardsController._defaultConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('dependencies.persistence', 'service-creditcards:persistence:*:*:1.0');
//# sourceMappingURL=CreditCardsController.js.map