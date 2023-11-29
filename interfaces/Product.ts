import { ICategory } from "./Category";

export interface Image {
    public_id: string;
    url: string
}
export interface IProduct {
    name: string;
    price: number;
    quantity: number;
    colors: string[];
    images: Image[];
    category: ICategory;
    miniDescription: string;
    description: string;
    isAvailable: boolean;
}