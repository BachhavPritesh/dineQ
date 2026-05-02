import { body, validationResult } from 'express-validator';

export const submitRatingValidator = [
  body('restaurantId')
    .notEmpty()
    .withMessage('Restaurant ID is required')
    .isMongoId(),
  body('score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Score must be between 1 and 5'),
];

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      data: errors
        .array()
        .map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};
