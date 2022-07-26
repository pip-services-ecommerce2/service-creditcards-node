import { IStringIdentifiable } from 'pip-services3-commons-nodex';
import { AddressV1 } from './AddressV1';
export declare class CreditCardV1 implements IStringIdentifiable {
    id: string;
    customer_id: string;
    create_time?: Date;
    update_time?: Date;
    type?: string;
    number?: string;
    expire_month?: number;
    expire_year?: number;
    first_name?: string;
    last_name?: string;
    billing_address?: AddressV1;
    state?: string;
    ccv?: string;
    name?: string;
    saved?: boolean;
    default?: boolean;
}
