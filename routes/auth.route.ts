import { Router } from 'express';
import { authController } from '@controllers';

const _router: Router = Router({
    mergeParams: true,
});

_router.route('/signup').post(authController.signup);
_router.route('/signin').post(authController.signin);
_router.route('/forgetPassword').post(authController.forgotPassword);
_router.route('/resetPassword').put(authController.resetPassword);

export const router = _router;
