import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@utils/HttpError';
import { jsonOne, jsonAll } from '@utils/general';
import Coupon, { ICouponModel } from '@models/Coupon';

const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, code, discount, minAmount, maxAmount } = req.body;

        const newCoupon = new Coupon({
            name,
            code,
            discount,
            minAmount,
            maxAmount,
        });

        const savedCoupon = await newCoupon.save();
        return jsonOne<ICouponModel>(res, 201, savedCoupon);
    } catch (error) {
        return next(error);
    }
};

const getCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = req.params.id;

        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            throw new HttpError(404, 'Coupon not found');
        }

        return jsonOne<ICouponModel>(res, 200, coupon);
    } catch (error) {
        return next(error);
    }
};

const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coupons = await Coupon.find();

        if (coupons.length === 0) {
            return jsonOne<any>(res, 404, 'No coupons found');
        }

        return jsonAll<ICouponModel>(res, 200, coupons);
    } catch (error) {
        return next(error);
    }
};

const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = req.params.id;
        const { name, code, discount, minAmount, maxAmount, isActive } = req.body;

        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            throw new HttpError(404, 'Coupon not found');
        }

        coupon.name = name;
        coupon.code = code;
        coupon.discount = discount;
        coupon.minAmount = minAmount;
        coupon.maxAmount = maxAmount;
        coupon.isActive = isActive;

        const updatedCoupon = await coupon.save();
        return jsonOne<ICouponModel>(res, 200, updatedCoupon);
    } catch (error) {
        return next(error);
    }
};

const changeCouponStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = req.params.id;

        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            throw new HttpError(404, 'Coupon not found');
        }

        coupon.isActive = false;
        const updatedCoupon = await coupon.save();

        return jsonOne<ICouponModel>(res, 200, updatedCoupon);
    } catch (error) {
        return next(error);
    }
};

const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const couponId = req.params.id;

        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            throw new HttpError(404, 'Coupon not found');
        }

        await coupon.remove();
        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

export default {
    createCoupon,
    getCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
    changeCouponStatus,
};
