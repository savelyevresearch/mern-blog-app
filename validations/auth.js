import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Incorrect email format').isEmail(),
    body('password', 'Password must be greater or equal to 8 characters').isLength({ min: 8 }),
    body('fullName', 'Fullname must be greater or equal to 3 characters').isLength({ min: 3 }),
    body('avatarUrl', 'Incorrect URL address').optional().isURL(),
];

export const loginValidation = [
    body('email', 'Incorrect email format').isEmail(),
    body('password', 'Password must be greater or equal to 8 characters').isLength({ min: 8 }),
];