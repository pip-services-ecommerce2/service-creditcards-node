"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditCardsHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class CreditCardsHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/credit_cards');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-creditcards', 'controller', 'default', '*', '1.0'));
    }
}
exports.CreditCardsHttpServiceV1 = CreditCardsHttpServiceV1;
//# sourceMappingURL=CreditCardsHttpServiceV1.js.map