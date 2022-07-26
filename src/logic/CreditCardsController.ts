import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';

import { IReferenceable } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { BadRequestException } from 'pip-services3-commons-nodex';

import { CreditCardV1 } from '../data/version1/CreditCardV1';
import { CreditCardStateV1 } from '../data/version1/CreditCardStateV1';
import { ICreditCardsPersistence } from '../persistence/ICreditCardsPersistence';
import { ICreditCardsController } from './ICreditCardsController';
import { CreditCardsCommandSet } from './CreditCardsCommandSet';

export class CreditCardsController implements  IConfigurable, IReferenceable, ICommandable, ICreditCardsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'service-creditcards:persistence:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(CreditCardsController._defaultConfig);
    private _persistence: ICreditCardsPersistence;
    private _commandSet: CreditCardsCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<ICreditCardsPersistence>('persistence');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new CreditCardsCommandSet(this);
        return this._commandSet;
    }
    
    public async getCreditCards(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<CreditCardV1>> {
        return await this._persistence.getPageByFilter(correlationId, filter, paging);
    }

    public async getCreditCardById(correlationId: string, id: string, customerId: string): Promise<CreditCardV1> {
        let card = await this._persistence.getOneById(correlationId, id);

        // Do not allow to access card of different customer
        if (card && card.customer_id != customerId)
            card = null;

        return card;
    }

    public async createCreditCard(correlationId: string, card: CreditCardV1): Promise<CreditCardV1> {
        card.state = card.state || CreditCardStateV1.Ok;
        card.create_time = new Date();
        card.update_time = new Date();

        return await this._persistence.create(correlationId, card);
    }

    public async updateCreditCard(correlationId: string, card: CreditCardV1): Promise<CreditCardV1> {
        let newCard: CreditCardV1;

        card.state = card.state || CreditCardStateV1.Ok;
        card.update_time = new Date();
        
        let data = await this._persistence.getOneById(correlationId, card.id);

        if (data && data.customer_id != card.customer_id) {
            throw new BadRequestException(correlationId, 'WRONG_CUST_ID', 'Wrong credit card customer id')
                .withDetails('id', card.id)
                .withDetails('customer_id', card.customer_id);
        }

        newCard = await this._persistence.update(correlationId, card);

        return newCard;
    }

    public async deleteCreditCardById(correlationId: string, id: string, customerId: string): Promise<CreditCardV1> {  
        let oldCard: CreditCardV1;

        let data = await this._persistence.getOneById(correlationId, id);

        if (data && data.customer_id != customerId) {
            throw new BadRequestException(correlationId, 'WRONG_CUST_ID', 'Wrong credit card customer id')
                .withDetails('id', id)
                .withDetails('customer_id', customerId);
        }

        oldCard = await this._persistence.deleteById(correlationId, id);

        return oldCard;
    }

}
