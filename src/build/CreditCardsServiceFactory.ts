import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { CreditCardsMongoDbPersistence } from '../persistence/CreditCardsMongoDbPersistence';
import { CreditCardsFilePersistence } from '../persistence/CreditCardsFilePersistence';
import { CreditCardsMemoryPersistence } from '../persistence/CreditCardsMemoryPersistence';
import { CreditCardsPayPalPersistence } from '../persistence/CreditCardsPayPalPersistence';
import { CreditCardsController } from '../logic/CreditCardsController';
import { CreditCardsHttpServiceV1 } from '../services/version1/CreditCardsHttpServiceV1';

export class CreditCardsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("service-creditcards", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("service-creditcards", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("service-creditcards", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("service-creditcards", "persistence", "mongodb", "*", "1.0");
	public static PayPalPersistenceDescriptor = new Descriptor("service-creditcards", "persistence", "paypal", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("service-creditcards", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("service-creditcards", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(CreditCardsServiceFactory.MemoryPersistenceDescriptor, CreditCardsMemoryPersistence);
		this.registerAsType(CreditCardsServiceFactory.FilePersistenceDescriptor, CreditCardsFilePersistence);
		this.registerAsType(CreditCardsServiceFactory.MongoDbPersistenceDescriptor, CreditCardsMongoDbPersistence);
		this.registerAsType(CreditCardsServiceFactory.PayPalPersistenceDescriptor, CreditCardsPayPalPersistence);
		this.registerAsType(CreditCardsServiceFactory.ControllerDescriptor, CreditCardsController);
		this.registerAsType(CreditCardsServiceFactory.HttpServiceDescriptor, CreditCardsHttpServiceV1);
	}
	
}
