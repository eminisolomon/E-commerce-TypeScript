import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';
import { jsonOne, jsonAll } from '@utils/general';
import Wishlist, { IWishlistModel } from '@models/Wishlist';
import User from '@/models/User';

const addWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];

        const user = await User.findById(userId);

        if (!user) {
            throw new HttpError(400, "User Not Found");
        }

        const { productId } = req.body;

        const existingWishlistItem = await Wishlist.findOne({ user: userId, product: productId });
        if (existingWishlistItem) {
            throw new HttpError(400, 'Product already exists in wishlist');
        }

        const newWishlistItem = new Wishlist({
            user: userId,
            product: productId,
        });

        const savedWishlistItem = await newWishlistItem.save();
        return jsonOne<IWishlistModel>(res, 201, savedWishlistItem);
    } catch (error) {
        return next(error);
    }
};

const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];

        const user = await User.findById(userId);

        if (!user) {
            throw new HttpError(400, "User Not Found");
        }
        const productId = req.params.id;

        const wishlistItem = await Wishlist.findOne({ user: userId, product: productId });
        if (!wishlistItem) {
            throw new HttpError(404, 'Product not found in wishlist');
        }

        await wishlistItem.remove();
        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

const getWishlists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];

        const user = await User.findById(userId);

        if (!user) {
            throw new HttpError(400, 'User Not Found');
        }

        const wishlists = await Wishlist.find({ user: userId });

        if (wishlists.length === 0) {
            return jsonOne<any>(res, 404, 'User has no wishlists');
        }

        return jsonAll<IWishlistModel>(res, 200, wishlists);
    } catch (error) {
        return next(error);
    }
};

export default {
    addWishlist,
    removeFromWishlist,
    getWishlists
};
