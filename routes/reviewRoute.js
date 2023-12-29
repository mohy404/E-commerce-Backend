const express = require('express');

 const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator
 } = require('../utils/validators/reviewValidatore');

const {
getReviews,
getReview,
createReview,
updateReview,
deleteReview,
createFilterObj,
setProductIdToBody
} = require('../services/reviewService');

const authService = require('../services/authService')

const router = express.Router({mergeParams: true});

router.route('/').get(createFilterObj ,getReviews)
.post(  
  authService.protect,
  authService.allowedTo("user"),
  setProductIdToBody,
  createReviewValidator,
  createReview);
router
  .route('/:id')
  .get(getReviewValidator,getReview)
  .put(  
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview)
  .delete( authService.protect,
    authService.allowedTo("user", "manager", "admin"),
    deleteReviewValidator,
   deleteReview);

module.exports = router; 