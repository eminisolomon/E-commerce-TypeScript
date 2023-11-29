import { Router } from 'express';
import { wishlistController } from '@controllers';

const _router: Router = Router({
    mergeParams: true,
});

_router.route('').post(wishlistController.addWishlist);
_router.route('/remove').get(wishlistController.removeFromWishlist);
_router.route('').get(wishlistController.getWishlists);

export const router = _router;
