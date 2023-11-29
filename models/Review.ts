import mongoose, { Document, Schema } from 'mongoose';
import { IReview } from '@interfaces/Review';

export interface IReviewModel extends IReview, Document { }

const ReviewSchema: Schema = new Schema(
    {
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            required: true,
        },
        reviewername: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    },
    { timestamps: true },
);

export default mongoose.model<IReviewModel>('Review', ReviewSchema);