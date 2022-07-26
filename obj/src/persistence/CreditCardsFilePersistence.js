"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditCardsFilePersistence = void 0;
const pip_services3_data_nodex_1 = require("pip-services3-data-nodex");
const CreditCardsMemoryPersistence_1 = require("./CreditCardsMemoryPersistence");
class CreditCardsFilePersistence extends CreditCardsMemoryPersistence_1.CreditCardsMemoryPersistence {
    constructor(path) {
        super();
        this._persister = new pip_services3_data_nodex_1.JsonFilePersister(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.CreditCardsFilePersistence = CreditCardsFilePersistence;
//# sourceMappingURL=CreditCardsFilePersistence.js.map