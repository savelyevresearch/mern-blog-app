import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Incorrect email format').isString().isEmail(),
    body('password', 'Password must be greater or equal to 8 characters').isString().isLength({ min: 8 }),
    body('fullName', 'Fullname must be greater or equal to 3 characters').isString().isLength({ min: 3 }),
    body('avatarUrl', 'Incorrect URL address').optional().isString().isURL(),
];

export const loginValidation = [
    body('email', 'Incorrect email format').isString().isEmail(),
    body('password', 'Password must be greater or equal to 8 characters').isString().isLength({ min: 8 }),
];