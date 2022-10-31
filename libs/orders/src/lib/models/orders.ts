import { Product } from '../../../../products/src/lib/models/product';
export interface Orders {
    autoID?: number;
    id?: string;
    orderItems?: OrderItem[];
    status?: any;
    shippingAddress1?: string;
    shippingAddress2?: string;
    city?: string;
    zip?: string;
    country?: string;
    phone?: string;
    totalPrice?: number;
    user?: any;
    dateOrdered?: any;
}

export interface OrderItem {
  product: Product ;
  quantity: number;
}
