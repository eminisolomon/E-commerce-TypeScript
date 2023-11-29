import { body } from 'express-validator';

// PASSWORD VALIDATOR FUNCTION
const password = (field) => {
  return body(field)
    .trim()
    .escape()
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password should not be empty and should be at least eight characters long.');
};

// RESET PASSWORD VALIDATOR FUNCTION
const resetPassword = (field) => {
  return body(field)
    .trim()
    .escape()
    .isString()
    .isLength({ min: 8 })
    .withMessage(`${field} should not be empty and at a minimum eight characters.`);
};

// EXPORT
export { password, resetPassword };
