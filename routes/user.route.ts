import { Router } from 'express';
import { userController } from '@controllers';

const _router: Router = Router({
    mergeParams: true,
});

_router.route('').get(userController.getUser);
_router.route('').put(userController.updateUser);
_router.route('/password').post(userController.changePassword);
_router.route('/all').get(userController.getUsers);
_router.route('').delete(userController.deleteUser);
_router.route('/refund').put(userController.refundUser);

export const router = _router;
