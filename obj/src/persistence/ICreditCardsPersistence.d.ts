import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IGetter } from 'pip-services3-data-nodex';
import { IWriter } from 'pip-services3-data-nodex';
import { CreditCardV1 } from '../data/version1/CreditCardV1';
export interface ICreditCardsPersistence extends IGetter<CreditCardV1, string>, IWriter<CreditCardV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<CreditCardV1>>;
    getOneById(correlationId: string, id: string): Promise<CreditCardV1>;
    create(correlationId: string, item: CreditCardV1): Promise<CreditCardV1>;
    update(correlationId: string, item: CreditCardV1): Promise<CreditCardV1>;
    deleteById(correlationId: string, id: string): Promise<CreditCardV1>;
}
