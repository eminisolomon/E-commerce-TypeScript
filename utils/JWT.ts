import * as jwt from 'jsonwebtoken';
import { HttpError } from '@utils/HttpError';

export const generateJWT = function (payload = {}, options = {}) {
  const privateKey = process.env.JWT_SECRETS;
  const defaultOptions = {
    expiresIn: 3 * 60 * 60 * 1000,
  };

  return jwt.sign(payload, privateKey, Object.assign(defaultOptions, options));
};

export const validateToken = function (token: string): Object {
  try {
    const publicKey: any = process.env.JWT_SECRETS;
    let JWTToken = token.slice(7);
    return jwt.verify(JWTToken, publicKey);
  } catch (e) {
    throw new HttpError(400, "Invalid token");
  }
};

export const extractToken = function (token: string): string | null {
    if (token?.startsWith('Bearer ')) {
      return token.slice(7, token.length);
    }
    return null;
  };