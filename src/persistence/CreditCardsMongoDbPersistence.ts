import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';

import { CreditCardV1 } from '../data/version1/CreditCardV1';
import { ICreditCardsPersistence } from './ICreditCardsPersistence';

export class CreditCardsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<CreditCardV1, string>
    implements ICreditCardsPersistence {

    constructor() {
        super('credit_cards');
        super.ensureIndex({ customer_id: 1 });
    }
    
    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        // Filter ids
        let ids = filter.getAsObject('ids');
        if (typeof ids === 'string')
            ids = ids.split(',');
        if (Array.isArray(ids))
            criteria.push({ _id: { $in: ids } });
            
        let state = filter.getAsNullableString('state');
        if (state != null)
            criteria.push({ state: state });

        let customerId = filter.getAsNullableString('customer_id');
        if (customerId != null)
            criteria.push({ customer_id: customerId });
                
        let saved = filter.getAsNullableBoolean('saved');
        if (saved != null)
            criteria.push({ saved: saved });

        return criteria.length > 0 ? { $and: criteria } : null;
    }
    
    public async getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<CreditCardV1>> {
        return await super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null);
    }

}
