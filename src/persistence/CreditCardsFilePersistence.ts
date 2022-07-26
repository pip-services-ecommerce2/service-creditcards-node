import { ConfigParams } from 'pip-services3-commons-nodex';
import { JsonFilePersister } from 'pip-services3-data-nodex';

import { CreditCardsMemoryPersistence } from './CreditCardsMemoryPersistence';
import { CreditCardV1 } from '../data/version1/CreditCardV1';

export class CreditCardsFilePersistence extends CreditCardsMemoryPersistence {
	protected _persister: JsonFilePersister<CreditCardV1>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<CreditCardV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}