"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditCardV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const AddressV1Schema_1 = require("./AddressV1Schema");
class CreditCardV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('customer_id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('create_time', pip_services3_commons_nodex_2.TypeCode.DateTime);
        this.withOptionalProperty('update_time', pip_services3_commons_nodex_2.TypeCode.DateTime);
        this.withRequiredProperty('type', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('number', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('expire_month', pip_services3_commons_nodex_2.TypeCode.Integer);
        this.withRequiredProperty('expire_year', pip_services3_commons_nodex_2.TypeCode.Integer);
        this.withRequiredProperty('first_name', pip_services3_commons_nodex_2.TypeCode.String);
        this.withRequiredProperty('last_name', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('billing_address', new AddressV1Schema_1.AddressV1Schema());
        this.withOptionalProperty('state', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('ccv', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('name', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('saved', pip_services3_commons_nodex_2.TypeCode.Boolean);
        this.withOptionalProperty('default', pip_services3_commons_nodex_2.TypeCode.Boolean);
    }
}
exports.CreditCardV1Schema = CreditCardV1Schema;
//# sourceMappingURL=CreditCardV1Schema.js.map