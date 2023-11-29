import { Router } from 'express';
import { productController } from '@controllers';

const _router: Router = Router({
  mergeParams: true,
});

_router.route('').post(productController.createProduct);
_router.route('/search').get(productController.searchProducts);
_router.route('').get(productController.getProducts);
_router.route('/:id').post(productController.getProduct);
_router.route('/:id').put(productController.updateProduct);
_router.route('/:id').delete(productController.deleteProduct);
_router.route('/:categoryId').get(productController.getCategoryProducts);

export const router = _router;
