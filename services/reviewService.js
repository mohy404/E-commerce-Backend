const factory = require('./HandlerFactory');
const Review = require('../models/reviewModel');



// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
  };


// @desc    Get list of Review
// @route   GET /api/v1/Review
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// Nested route
exports.setProductIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id
    next();
  };

// @desc    Create reviews
// @route   POST  /api/v1/reviews
// @access  Private/protect/User
exports.createReview = factory.createOne(Review);

// @desc    Update specific reviews
// @route   PUT /api/v1/reviews/:id
// @access  Private/protect/User
exports.updateReview = factory.updateOne(Review);

// @desc    Delete specific reviews
// @route   DELETE /api/v1/reviews/:id
// @access  Private/protect/User, Admin, Manager
exports.deleteReview = factory.deleteOne(Review);

