export interface ICoupon {
    name: string;
    code: string;
    discount: number;
    minAmount: number;
    maxAmount: number;
    isActive: boolean;
}