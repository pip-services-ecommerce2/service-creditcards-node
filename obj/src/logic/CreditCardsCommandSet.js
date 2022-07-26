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
exports.CreditCardsCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_7 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_8 = require("pip-services3-commons-nodex");
const CreditCardV1Schema_1 = require("../data/version1/CreditCardV1Schema");
class CreditCardsCommandSet extends pip_services3_commons_nodex_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetCreditCardsCommand());
        this.addCommand(this.makeGetCreditCardByIdCommand());
        this.addCommand(this.makeCreateCreditCardCommand());
        this.addCommand(this.makeUpdateCreditCardCommand());
        this.addCommand(this.makeDeleteCreditCardByIdCommand());
    }
    makeGetCreditCardsCommand() {
        return new pip_services3_commons_nodex_2.Command("get_credit_cards", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_nodex_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_nodex_8.PagingParamsSchema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services3_commons_nodex_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_nodex_4.PagingParams.fromValue(args.get("paging"));
            return yield this._logic.getCreditCards(correlationId, filter, paging);
        }));
    }
    makeGetCreditCardByIdCommand() {
        return new pip_services3_commons_nodex_2.Command("get_credit_card_by_id", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('card_id', pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty('customer_id', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let cardId = args.getAsString("card_id");
            let customerId = args.getAsString("customer_id");
            return yield this._logic.getCreditCardById(correlationId, cardId, customerId);
        }));
    }
    makeCreateCreditCardCommand() {
        return new pip_services3_commons_nodex_2.Command("create_credit_card", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('card', new CreditCardV1Schema_1.CreditCardV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let card = args.get("card");
            return yield this._logic.createCreditCard(correlationId, card);
        }));
    }
    makeUpdateCreditCardCommand() {
        return new pip_services3_commons_nodex_2.Command("update_credit_card", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('card', new CreditCardV1Schema_1.CreditCardV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let card = args.get("card");
            return yield this._logic.updateCreditCard(correlationId, card);
        }));
    }
    makeDeleteCreditCardByIdCommand() {
        return new pip_services3_commons_nodex_2.Command("delete_credit_card_by_id", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty('card_id', pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty('customer_id', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let cardId = args.getAsNullableString("card_id");
            let customerId = args.getAsString("customer_id");
            return yield this._logic.deleteCreditCardById(correlationId, cardId, customerId);
        }));
    }
}
exports.CreditCardsCommandSet = CreditCardsCommandSet;
//# sourceMappingURL=CreditCardsCommandSet.js.map