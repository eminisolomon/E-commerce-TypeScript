import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from '@interfaces/Category';

export interface ICategoryModel extends ICategory, Document { }

const CategorySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: {
            public_id: String,
            url: String,
        },
    },
    { timestamps: true },
);

export default mongoose.model<ICategoryModel>('Category', CategorySchema);