// User CRUD Operations (Admin)
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')

const factory = require('./HandlerFactory');
const {uploadSingleImage} = require("../middleware/uploadImageMiddlewar");
const User = require('../models/userModel');
const createToken = require('../utils/createToken')
const ApiError = require('../utils/apiError');


// Upload Single image 
exports.uploadUserImage = uploadSingleImage("profileImg")

// Image Processing
exports.resizeImage = asyncHandler( async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`

        if (req.file) {
            await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({quality: 95})
            .toFile(`uploads/users/${filename}`)
        
            // Save image into our db
            req.body.profileImg = filename
        }
    next()
})


// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private
exports.getUser = factory.getOne(User);

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private
exports.createUser = factory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser =  asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id, 
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    }, 
    {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id, 
    {
      password: await bcrypt.hash(req.body.password, 12) ,
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });
// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);


// @desc    Get Logged user data 
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id
  next()
})

// @desc    Update Logged user password
// @route   PUT /api/v1/users/updateMypassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id, 
    {
      password: await bcrypt.hash(req.body.password, 12) ,
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    });

    // 2- Generate Token 
    const token = createToken(user._id)

    res.status(200).json({data: user, token})
})

// @desc    Update Logged user name, email, phone
// @route   PUT /api/v1/users/updateMypassword
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) =>{
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {new: true}
  )
  res.status(200).json({data: updatedUser});
})

// @desc    Deactivate Logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deactiveLoggedUserAccount = asyncHandler(async (req, res, next) => {
await User.findByIdAndUpdate(req.user._id, {active: false})

res.status(204).json({status: 'Success'})
})