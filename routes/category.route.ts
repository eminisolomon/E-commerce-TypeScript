import { Router } from 'express';
import { categoryController } from '@controllers';

const _router: Router = Router({
  mergeParams: true,
});

_router.route('').get(categoryController.getCategories);
_router.route('/:id').get(categoryController.getCategory);
_router.route('').post(categoryController.createCategory);
_router.route('/:id').put(categoryController.updateCategory);
_router.route('/:id').delete(categoryController.deleteCategory);

export const router = _router;
