import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';
import { jsonAll, jsonOne } from '@utils/general';
import Review, { IReviewModel } from '@models/Review';
import Product from '@models/Product';
import User from '@/models/User';

const addReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        const user = await User.findById(userId);

        if (!user) {
            throw new HttpError(422, "User not found");
        }

        const { rating, title, reviewername } = req.body;
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) {
            throw new HttpError(404, 'Product not found');
        }

        const newReview = new Review({
            rating,
            title,
            reviewername,
            user,
            product: productId,
        });

        const savedReview = await newReview.save();
        return jsonOne<IReviewModel>(res, 201, savedReview);
    } catch (error) {
        return next(error);
    }
};

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];

        const reviewId = req.params.reviewId;

        const review = await Review.findOne({ _id: reviewId, user: userId });
        if (!review) {
            throw new HttpError(404, 'Review not found');
        }

        await review.remove();
        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.productId;

        const reviews = await Review.find({ product: productId });

        if (reviews.length === 0) {
            return jsonOne<any>(res, 404, 'Product has no reviews');
        }

        const totalReviews = reviews.length;

        const response = {
            totalReviews,
            reviews,
        };

        return jsonAll<any>(res, 200, response);
    } catch (error) {
        return next(error);
    }
};

export default {
    addReview,
    deleteReview,
    getProductReviews
};
