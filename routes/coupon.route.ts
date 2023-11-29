import { Router } from 'express';
import { couponController } from '@controllers';

const _router: Router = Router({
    mergeParams: true,
});

_router.route('').post(couponController.createCoupon);
_router.route('/status/:id').put(couponController.changeCouponStatus);
_router.route('/:id').put(couponController.updateCoupon);
_router.route('/:id').get(couponController.getCoupon);
_router.route('').get(couponController.getCoupons);
_router.route('/:id').delete(couponController.deleteCoupon);

export const router = _router;
