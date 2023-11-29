import { IProduct } from "./Product";
import { IUser } from "./User";

export interface IReview {
    rating: number;
    title: string;
    user: IUser;
    reviewername: string;
    product: IProduct;
}