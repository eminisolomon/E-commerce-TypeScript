import { Router } from 'express';
import { addressController } from '@controllers';

const _router: Router = Router({
  mergeParams: true,
});

_router.route('').get(addressController.getAddresses);
_router.route('').post(addressController.addAddress);
_router.route('').put(addressController.updateAddress);
_router.route('/:id').delete(addressController.deleteAddress);

export const router = _router;
