import { Router } from 'express';
import { reviewController } from '@controllers';

const _router: Router = Router({
  mergeParams: true,
});

_router.route('').get(reviewController.getProductReviews);
_router.route('').post(reviewController.addReview);
_router.route('/:id').delete(reviewController.deleteReview);

export const router = _router;
