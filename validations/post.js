import { body } from "express-validator";

export const postCreateValidation = [
    body('title', 'Incorrect title format').isLength({ min: 3 }).isString(),
    body('text', 'Enter the complete post content').isLength({ min: 10 }).isString(),
    body('tags', 'Incorrect tags format (specify an array)').optional().isArray(),
    body('imageUrl', 'Incorrect image URL').optional().isURL(),
];