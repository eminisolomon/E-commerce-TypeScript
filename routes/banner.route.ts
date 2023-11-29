import { Router } from 'express';
import { bannerController } from '@controllers';

const _router: Router = Router({
  mergeParams: true,
});

_router.route('').get(bannerController.getBanners);
_router.route('/:id').get(bannerController.getBanner);
_router.route('').post(bannerController.createBanner);
_router.route('/status/:id').put(bannerController.changeBannerStatus);
_router.route('/:id').put(bannerController.updateBanner);
_router.route('/:id').delete(bannerController.deleteBanner);

export const router = _router;
