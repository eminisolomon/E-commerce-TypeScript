import mongoose, { Document, Schema } from 'mongoose';
import { IOrder } from '@interfaces/Order';

export interface IOrderModel extends IOrder, Document { }

const SingleOrderSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    },
);

const OrderSchema: Schema = new Schema(
    {
        status: {
            type: String,
            enum: ["pending", "complete"],
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tax: {
            type: Number,
            required: true,
        },
        shippingFee: {
            type: Number,
            required: true,
        },
        deliveryFee: {
            type: Number,
            required: true,
        },
        subtotal: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paymentReference: {
            type: String,
        },
        orderItems: {
            type: [SingleOrderSchema],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IOrderModel>('Order', OrderSchema);
