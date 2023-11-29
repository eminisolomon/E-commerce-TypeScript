import mongoose, { Document, Schema } from 'mongoose';
import { IBanner } from '@interfaces/Banner';

export interface IBannerModel extends IBanner, Document { }

const BannerSchema: Schema = new Schema(
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
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true },
);

export default mongoose.model<IBannerModel>('Banner', BannerSchema);