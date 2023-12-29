const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const User = require('../models/userModel');


// @desc    add product to wishList
// @route   GET /api/v1/wishlist
// @access  Proteced/User
exports.addToWishList = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {wishlist: req.body.productId},
        },
        {new: true}
    )

    res.status(200).json({
        success: true,
        message: "Product added Successfully to your wishlist.",
        data: user.wishlist
    })
})


// @desc    Remove product from wishList
// @route   DELETE /api/v1/wishlist/:productId
// @access  Proteced/User
exports.removeWishList = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {wishlist: req.params.productId},
        },
        {new: true}
    )

    res.status(200).json({
        success: true,
        message: "Product removed Successfully from your wishlist.",
        data: user.wishlist
    })
})

// @desc    Get logged user wishlist
// @route   GET /api/v1/wishlist
// @access  Proteced/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    if(!req.user) return next( new ApiError("You are not logged in", 401))
    const userData = await User.findById(req.user._id).populate('wishlist')

    res.status(200).json({
        status:'success', 
         results: userData.wishlist.length,
         data: userData.wishlist})
})