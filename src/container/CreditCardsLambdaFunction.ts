import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableLambdaFunction } from 'pip-services3-aws-nodex';
import { CreditCardsServiceFactory } from '../build/CreditCardsServiceFactory';

export class CreditCardsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("credit_cards", "Credit cards function");
        this._dependencyResolver.put('controller', new Descriptor('service-creditcards', 'controller', 'default', '*', '*'));
        this._factories.add(new CreditCardsServiceFactory());
    }
}

export const handler = new CreditCardsLambdaFunction().getHandler();