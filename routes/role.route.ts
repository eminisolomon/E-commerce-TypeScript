import { Router } from 'express';
import { roleController } from '@controllers';


const _router: Router = Router({
    mergeParams: true,
});


_router.route('/list').get(roleController.getAllRole);

export const router = _router;
