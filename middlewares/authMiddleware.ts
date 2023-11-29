import { Request, Response, NextFunction } from 'express';
import { validateToken } from '@/utils/JWT';
import { HttpError } from '@utils/HttpError';

const auth = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;

    const payload = validateToken(token);

    req['tokenPayload'] = payload;
    next();
  } catch (e) {
    if (e.opts?.title === 'invalid_token') {
      next(
        new HttpError(401, "Invalid Authorization header"),
      );
    } else {
      console.log('Other error:', e);
      next(e);
    }
  }
};

export default auth;
