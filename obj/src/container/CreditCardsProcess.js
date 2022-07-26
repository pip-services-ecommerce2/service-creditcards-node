"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditCardsProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const CreditCardsServiceFactory_1 = require("../build/CreditCardsServiceFactory");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
class CreditCardsProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super("credit_cards", "Credit cards microservice");
        this._factories.add(new CreditCardsServiceFactory_1.CreditCardsServiceFactory);
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory);
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory);
    }
}
exports.CreditCardsProcess = CreditCardsProcess;
//# sourceMappingURL=CreditCardsProcess.js.map