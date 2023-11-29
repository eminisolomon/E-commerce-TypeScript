import mongoose, { Document, Schema } from 'mongoose';
import { ICoupon } from '@interfaces/Coupon';

export interface ICouponModel extends ICoupon, Document { }

const CouponSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        discount: {
            type: String,
        },
        minAmount: {
            type: Number,
            required: true,
        },
        maxAmount: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true },
);

export default mongoose.model<ICouponModel>('Coupon', CouponSchema);