const express = require('express');

const {
   addToWishList, 
   removeWishList,
   getLoggedUserWishlist
  } = require('../services/wishlistService');

const authService = require('../services/authService')

const router = express.Router();

router.route('/').post(  
  authService.protect,
  authService.allowedTo("user"),
  addToWishList
)
.get(
  authService.protect,
  authService.allowedTo("admin", "user"),
  getLoggedUserWishlist
)
router.delete(
 '/:productId', 
 authService.protect,
 authService.allowedTo("user"),
 removeWishList
)

module.exports = router;