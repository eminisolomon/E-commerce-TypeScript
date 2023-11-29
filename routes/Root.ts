import { NextFunction, Request, Response, Router } from 'express';
import { router as Role } from './role.route';
import { router as Category } from './category.route';
import { router as Product } from './product.route';
import { router as Address } from './address.route';
import { router as Review } from './review.route';
import { router as Auth } from './auth.route';
import { router as User } from './user.route';
import { router as Order } from './order.route';
import { router as Wishlist } from './wishlist.route';
import { router as Coupon } from './coupon.route';
import { router as Banner } from './banner.route';

const _router: Router = Router({
  mergeParams: true,
});

_router.use(function (req: Request, res: Response, next: NextFunction) {
  res.setHeader('Api-Version', 'v1');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

_router.route('/v1/health-check').get(function (req: Request, res: Response) {
  return res.status(200).json({ healthy: true, version: 'v1' });
});

_router.use('/v1/role', Role);
_router.use('/v1/auth', Auth);
_router.use('/v1/user', User);
_router.use('/v1/category', Category);
_router.use('/v1/products', Product);
_router.use('/v1/address', Address);
_router.use('/v1/reviews', Review);
_router.use('/v1/order', Order);
_router.use('/v1/wishlist', Wishlist);
_router.use('/v1/coupons', Coupon);
_router.use('/v1/banner', Banner);

export const router = _router;
