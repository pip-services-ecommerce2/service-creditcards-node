import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableHttpService } from 'pip-services3-rpc-nodex';

export class CreditCardsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/credit_cards');
        this._dependencyResolver.put('controller', new Descriptor('service-creditcards', 'controller', 'default', '*', '1.0'));
    }
}