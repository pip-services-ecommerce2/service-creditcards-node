"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditCardsServiceFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const CreditCardsMongoDbPersistence_1 = require("../persistence/CreditCardsMongoDbPersistence");
const CreditCardsFilePersistence_1 = require("../persistence/CreditCardsFilePersistence");
const CreditCardsMemoryPersistence_1 = require("../persistence/CreditCardsMemoryPersistence");
const CreditCardsPayPalPersistence_1 = require("../persistence/CreditCardsPayPalPersistence");
const CreditCardsController_1 = require("../logic/CreditCardsController");
const CreditCardsHttpServiceV1_1 = require("../services/version1/CreditCardsHttpServiceV1");
class CreditCardsServiceFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(CreditCardsServiceFactory.MemoryPersistenceDescriptor, CreditCardsMemoryPersistence_1.CreditCardsMemoryPersistence);
        this.registerAsType(CreditCardsServiceFactory.FilePersistenceDescriptor, CreditCardsFilePersistence_1.CreditCardsFilePersistence);
        this.registerAsType(CreditCardsServiceFactory.MongoDbPersistenceDescriptor, CreditCardsMongoDbPersistence_1.CreditCardsMongoDbPersistence);
        this.registerAsType(CreditCardsServiceFactory.PayPalPersistenceDescriptor, CreditCardsPayPalPersistence_1.CreditCardsPayPalPersistence);
        this.registerAsType(CreditCardsServiceFactory.ControllerDescriptor, CreditCardsController_1.CreditCardsController);
        this.registerAsType(CreditCardsServiceFactory.HttpServiceDescriptor, CreditCardsHttpServiceV1_1.CreditCardsHttpServiceV1);
    }
}
exports.CreditCardsServiceFactory = CreditCardsServiceFactory;
CreditCardsServiceFactory.Descriptor = new pip_services3_commons_nodex_1.Descriptor("service-creditcards", "factory", "default", "default", "1.0");
CreditCardsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-creditcards", "persistence", "memory", "*", "1.0");
CreditCardsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-creditcards", "persistence", "file", "*", "1.0");
CreditCardsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-creditcards", "persistence", "mongodb", "*", "1.0");
CreditCardsServiceFactory.PayPalPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-creditcards", "persistence", "paypal", "*", "1.0");
CreditCardsServiceFactory.ControllerDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-creditcards", "controller", "default", "*", "1.0");
CreditCardsServiceFactory.HttpServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-creditcards", "service", "http", "*", "1.0");
//# sourceMappingURL=CreditCardsServiceFactory.js.map