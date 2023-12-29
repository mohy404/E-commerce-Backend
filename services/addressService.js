const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');


// @desc    add address to user list
// @route   POST /api/v1/address
// @access  Proteced/User
exports.addAddress = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {addresses: req.body},
        },
        {new: true}
    )

    res.status(200).json({
        success: true,
        message: "Address Successfully to your list.",
        data: user.addresses
    })
})


// @desc    Remove address from addresses list
// @route   DELETE /api/v1/wishlist/:addressId
// @access  Proteced/User
exports.removeAddress = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {addresses: { _id: req.params.addressId }},
        },
        {new: true}
    )

    res.status(200).json({
        success: true,
        message: "Address removed Successfully.",
        data: user.addresses
    })
})

// @desc    Get logged user addresses list
// @route   GET /api/v1/addresses
// @access  Proteced/User
exports.getLoggedUserAddress = asyncHandler(async (req, res, next) => {
    const userData = await User.findById(req.user._id).populate('addresses')

    res.status(200).json({
        status:'success', 
         results: userData.addresses.length,
         data: userData.addresses})
})