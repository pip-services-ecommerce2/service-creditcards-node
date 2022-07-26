import { DataPage } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { CreditCardV1 } from '../data/version1/CreditCardV1';

export interface ICreditCardsController {
    getCreditCards(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<CreditCardV1>>;

    getCreditCardById(correlationId: string, card_id: string, customer_id: string): Promise<CreditCardV1>;

    createCreditCard(correlationId: string, card: CreditCardV1): Promise<CreditCardV1>;

    updateCreditCard(correlationId: string, card: CreditCardV1): Promise<CreditCardV1>;

    deleteCreditCardById(correlationId: string, card_id: string, customer_id: string): Promise<CreditCardV1>;
}
