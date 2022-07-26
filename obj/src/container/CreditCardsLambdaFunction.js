"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.CreditCardsLambdaFunction = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_aws_nodex_1 = require("pip-services3-aws-nodex");
const CreditCardsServiceFactory_1 = require("../build/CreditCardsServiceFactory");
class CreditCardsLambdaFunction extends pip_services3_aws_nodex_1.CommandableLambdaFunction {
    constructor() {
        super("credit_cards", "Credit cards function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-creditcards', 'controller', 'default', '*', '*'));
        this._factories.add(new CreditCardsServiceFactory_1.CreditCardsServiceFactory());
    }
}
exports.CreditCardsLambdaFunction = CreditCardsLambdaFunction;
exports.handler = new CreditCardsLambdaFunction().getHandler();
//# sourceMappingURL=CreditCardsLambdaFunction.js.map