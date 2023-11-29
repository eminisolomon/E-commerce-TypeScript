import { Router } from 'express';
import { orderController } from '@controllers';

const _router: Router = Router({
    mergeParams: true,
});

_router.route('').post(orderController.createOrder);
_router.route('').get(orderController.getOrder);
_router.route('/ordes').get(orderController.getOrders);
_router.route('/all').get(orderController.adminGetOrders);
_router.route('/status').put(orderController.changeOrderStatus);

export const router = _router;
