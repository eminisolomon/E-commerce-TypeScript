import { body, header } from 'express-validator';
import { extractToken } from '@utils/JWT';

const authorization = () => {
  return header('authorization')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .withMessage('Missing authentication header')
    .bail()
    .customSanitizer((token, { location }) => {
      if (location === 'headers') {
        return extractToken(token);
      }
    })
    .isJWT()
    .withMessage('Invalid Authorization header, must be Bearer authorization');
};

const emailAddress = () => {
  return body('email')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .withMessage('Email address is required')
    .bail()
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage('Email address must be between 3 and 100 characters')
    .bail()
    .isEmail()
    .withMessage('Email address is not valid')
    .customSanitizer(email => {
      return email.toLowerCase();
    });
};

const loginPassword = () => {
  return body('password')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .isString()
    .isLength({
      max: 255,
    })
    .withMessage('Password is not valid');
};

export {
  authorization,
  emailAddress,
  loginPassword,

};
