import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from '@interfaces/Product';

export interface IProductModel extends IProduct, Document { }

const ProductSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        colors: [{
            type: String,
        }],
        images: [{
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Category",
        },
        miniDescription: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<IProductModel>('Product', ProductSchema);