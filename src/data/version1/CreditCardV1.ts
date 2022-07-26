import { IStringIdentifiable } from 'pip-services3-commons-nodex';
import { AddressV1 } from './AddressV1';

export class CreditCardV1 implements IStringIdentifiable {
    public id: string;
    public customer_id: string;

    public create_time?: Date;
    public update_time?: Date;
    
    public type?: string;
    public number?: string;
    public expire_month?: number;
    public expire_year?: number;
    public first_name?: string;
    public last_name?: string;
    public billing_address?: AddressV1;
    public state?: string;
    public ccv?: string;

    public name?: string;
    public saved?: boolean;
    public default?: boolean;
}