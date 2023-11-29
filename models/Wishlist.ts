import mongoose, { Document, Schema } from 'mongoose';
import { IWishlist } from '@interfaces/Wishlist';

export interface IWishlistModel extends IWishlist, Document { }

const WishlistSchema: Schema = new Schema(
    {
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

export default mongoose.model<IWishlistModel>('Wishlist', WishlistSchema);