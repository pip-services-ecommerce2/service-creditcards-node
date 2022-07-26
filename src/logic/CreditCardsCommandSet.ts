import { CommandSet } from 'pip-services3-commons-nodex';
import { ICommand } from 'pip-services3-commons-nodex';
import { Command } from 'pip-services3-commons-nodex';
import { Parameters } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';
import { FilterParamsSchema } from 'pip-services3-commons-nodex';
import { PagingParamsSchema } from 'pip-services3-commons-nodex';

import { CreditCardV1 } from '../data/version1/CreditCardV1';
import { CreditCardV1Schema } from '../data/version1/CreditCardV1Schema';
import { ICreditCardsController } from './ICreditCardsController';

export class CreditCardsCommandSet extends CommandSet {
    private _logic: ICreditCardsController;

    constructor(logic: ICreditCardsController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetCreditCardsCommand());
		this.addCommand(this.makeGetCreditCardByIdCommand());
		this.addCommand(this.makeCreateCreditCardCommand());
		this.addCommand(this.makeUpdateCreditCardCommand());
		this.addCommand(this.makeDeleteCreditCardByIdCommand());
    }

	private makeGetCreditCardsCommand(): ICommand {
		return new Command(
			"get_credit_cards",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            async (correlationId: string, args: Parameters) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                return await this._logic.getCreditCards(correlationId, filter, paging);
            }
		);
	}

	private makeGetCreditCardByIdCommand(): ICommand {
		return new Command(
			"get_credit_card_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('card_id', TypeCode.String)
				.withRequiredProperty('customer_id', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let cardId = args.getAsString("card_id");
                let customerId = args.getAsString("customer_id");
				return await this._logic.getCreditCardById(correlationId, cardId, customerId);
            }
		);
	}

	private makeCreateCreditCardCommand(): ICommand {
		return new Command(
			"create_credit_card",
			new ObjectSchema(true)
				.withRequiredProperty('card', new CreditCardV1Schema()),
            async (correlationId: string, args: Parameters) => {
                let card = args.get("card");
				return await this._logic.createCreditCard(correlationId, card);
            }
		);
	}

	private makeUpdateCreditCardCommand(): ICommand {
		return new Command(
			"update_credit_card",
			new ObjectSchema(true)
				.withRequiredProperty('card', new CreditCardV1Schema()),
            async (correlationId: string, args: Parameters) => {
                let card = args.get("card");
				return await this._logic.updateCreditCard(correlationId, card);
            }
		);
	}
	
	private makeDeleteCreditCardByIdCommand(): ICommand {
		return new Command(
			"delete_credit_card_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('card_id', TypeCode.String)
				.withRequiredProperty('customer_id', TypeCode.String),
            async (correlationId: string, args: Parameters) => {
                let cardId = args.getAsNullableString("card_id");
                let customerId = args.getAsString("customer_id");
				return await this._logic.deleteCreditCardById(correlationId, cardId, customerId);
			}
		);
	}

}