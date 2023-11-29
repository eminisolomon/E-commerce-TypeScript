import { Request, Response, NextFunction } from 'express';
import { HttpError } from '@utils/HttpError';

const permit = function (allowedRoles: Array<string>) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const payload = req['tokenPayload'];
    if (allowedRoles.includes(payload['role'])) {
      next();
    } else {
      next(
        new HttpError(403, "Access Forbiden"),
      );
    }
  };
};
export default permit;
