import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-nodex';
import { CreditCardV1 } from '../data/version1/CreditCardV1';
import { ICreditCardsPersistence } from './ICreditCardsPersistence';
export declare class CreditCardsMemoryPersistence extends IdentifiableMemoryPersistence<CreditCardV1, string> implements ICreditCardsPersistence {
    constructor();
    private contains;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<CreditCardV1>>;
}
