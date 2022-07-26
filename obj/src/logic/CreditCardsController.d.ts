import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { CreditCardV1 } from '../data/version1/CreditCardV1';
import { ICreditCardsController } from './ICreditCardsController';
export declare class CreditCardsController implements IConfigurable, IReferenceable, ICommandable, ICreditCardsController {
    private static _defaultConfig;
    private _dependencyResolver;
    private _persistence;
    private _commandSet;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getCommandSet(): CommandSet;
    getCreditCards(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<CreditCardV1>>;
    getCreditCardById(correlationId: string, id: string, customerId: string): Promise<CreditCardV1>;
    createCreditCard(correlationId: string, card: CreditCardV1): Promise<CreditCardV1>;
    updateCreditCard(correlationId: string, card: CreditCardV1): Promise<CreditCardV1>;
    deleteCreditCardById(correlationId: string, id: string, customerId: string): Promise<CreditCardV1>;
}
