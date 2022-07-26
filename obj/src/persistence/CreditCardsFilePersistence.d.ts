import { ConfigParams } from 'pip-services3-commons-nodex';
import { JsonFilePersister } from 'pip-services3-data-nodex';
import { CreditCardsMemoryPersistence } from './CreditCardsMemoryPersistence';
import { CreditCardV1 } from '../data/version1/CreditCardV1';
export declare class CreditCardsFilePersistence extends CreditCardsMemoryPersistence {
    protected _persister: JsonFilePersister<CreditCardV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
