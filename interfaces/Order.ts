import { IProduct } from "./Product";
import { IUser } from "./User";

interface SingleOrder {
    name: string;
    image: string;
    price: number;
    amount: number;
    product: IProduct;
}
export interface IOrder {
    tax: number;
    shippingFee: number;
    deliveryFee: number;
    subtotal: number;
    total: number;
    isDelivered: boolean;
    paymentReference: string;
    isPaid: boolean;
    orderItems: SingleOrder[];
    status: string;
    user: IUser;
}