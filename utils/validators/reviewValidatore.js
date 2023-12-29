const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatoreMiddleware');
const Review = require('../../models/reviewModel')

exports.createReviewValidator = [
    check('title').optional(),
    check('ratings')
      .notEmpty().withMessage('Ratings value is required')
      .isFloat({ min: 1, max: 5 }).withMessage('Ratings value must be between 1 to 5'),
    check('user').isMongoId().withMessage('Invalid Review id format'),
    check('product')
      .isMongoId().withMessage('Invalid Review id format')
      .custom(async (val, { req }) => {
        // Check if the user has already reviewed the product
        const existingReview = await Review.findOne({ user: req.user._id, product: req.body.product });
  
        if (existingReview) {
          throw new Error('You already created a review for this product before');
        }
      }),
    validatorMiddleware, // Assuming validatorMiddleware is defined somewhere in your code
];

exports.getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format'),
    validatorMiddleware,
  ];

exports.updateReviewValidator = [
    check('id')
    .isMongoId().withMessage('Invalid Review id format')
    .custom(async (val, { req }) => {
      // Check review ownership before update
      const review = await Review.findById(val);

      if (!review) {
        throw new Error(`There is no review with id ${val}`);
      }

      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error('You are not the owner of this review');
      }
    }),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
    check('id')
    .isMongoId().withMessage('Invalid Review id format')
    .custom(async (val, { req }) => {
      // Check review ownership before delete
      if (req.user.role === 'user') {
      const review = await Review.findById(val);

      if (!review) {
        throw new Error(`There is no review with id ${val}`);
      }

      // Check if the user is the owner, an admin, or a manager
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error('You do not have permission to delete this review');
      }
      }
      return true; // If the checks pass, return true
    }),
  validatorMiddleware, 
];