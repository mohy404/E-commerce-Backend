// SignUp , Login , ForgetPassword , ResetPassword , Logout

const crypto = require('crypto')

const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const User = require('../models/userModel')
const ApiError = require('../utils/apiError')
const  sendEmail  = require('../utils/senEmail')
const createToken = require('../utils/createToken')

// @desc    SignUp
// @route   POST  /api/v1/auth/signup
// @access  Public
exports.signUp = asyncHandler(async (req, res, next) =>{
    // 1- Create User 
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })
    // 2- Generate token
    const token = createToken(user._id)
    // 3- Send response with token to the client
    res.status(201).json({data: user, token})
})

// @desc    Login
// @route   POST  /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})
    if(!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError("Invalid Email or Password",401))
    }

    const token = createToken(user._id)
    res.status(200).json({data: user, token})
})

// @desc    make sure user is logged In
exports.protect = asyncHandler(async (req, res, next) =>{
    // 1- Check if Token exist, if exist Hold
    let token
    if (req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new ApiError("You are not logged in! Please login first.",401))
    }
    // 2- Verify token (no change happens, expired token)
    const decoded =  jwt.verify(token, process.env.JWT_SECRET_KEY)

    // 3- check if user exists
    const currentUser = await User.findById(decoded.userId)
    if (!currentUser){
        return next(new ApiError("The user does not exist!" ,401))
    }
    // 4- check if user change his password after token created
    if (currentUser.passwordChangedAt){
        const passwordChangedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000, 10
        )
        // Password change after token created (Error)
        if (passwordChangedTimestamp > decoded.iat) {
            return next(new ApiError("Password has been changed. Please log in again." ,401))
        }
    }
    req.user = currentUser
    next()
})

// @desc Authoraztion (User Permissinos)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>
asyncHandler(async (req, res, next) =>{
    // 1- access roles 
    // 2- access registerd user (req,user.role)
    if (!roles.includes(req.user.role)){
        return next(new ApiError("Not allowed to perform this action" ,403))
    }
    next()
})

// @desc    Forget password
// @route   POST  /api/v1/auth/forgetPassword
// @access  Public
exports.forgetPassord = asyncHandler(async (req, res, next) => {
    // 1- Get user by email
    const user = await User.findOne({email: req.body.email});
    if(!user) {
     return next(new ApiError(`There is no account with that email address associated with your profile. ${req.body.email}`, 404));
    }
    // 2- if user exist, Generte hash random 6 digits and save it in DB
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex')

    // Save hashed password reset code into db
    user.passwordResetCode = hashedResetCode
    // Add expiration time for password reset code (10 min)
    user.activeAccountToken = Date.now() + 10 * 60 * 1000
    user.isActive = false

    await user.save()

        const message = `Hi 👋${user.name} \n We received a request to reset Password, in this code is ${resetCode}`
    // 3- send reset code via email
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code Valod for 10 min',
            message,
        })
    }catch(err){
        user.passwordResetCode = undefined;
        user.activeAccountToken = undefined;
        user.isActive = undefined;

        await user.save();
        return next(new ApiError ('There is an error in sending email', 500))
    }
    res.status(200)
    .json({status: 'Success', message: 'Reset coce sent to email'})
})

// @desc    Verify password
// @route   POST  /api/v1/auth/VerifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler (async (req, res, next ) => {
    // 1- Get user based on reset code 
    const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex')

    const user = await User.findOne({passwordResetCode: hashedResetCode,
        activeAccountToken: {$gt: Date.now() },
    })
    if (!user) {
       return next(new ApiError ('Invalid Reset Code or Expired Token'))
    }

    // 2- Reset code valid
    user.active = true
    await user.save()

    res.status(200).json({
        status:'success',
    })
})

// @desc    Reset password
// @route   POST  /api/v1/auth/ResetPassword
// @access  Public

exports.resetPassword = asyncHandler( async (req, res, next) => {
    const user = await User.findOne({email: req.body.email })
    if(!user) {
        return next(new ApiError("User not found",404))
    }
    if (!user.isActive) {
        return next(new ApiError('Reset code not verified', 400))
    }
    user.password = req.body.newPassword
    user.passwordResetCode = undefined;
    user.activeAccountToken = undefined;
    user.isActive = undefined;

    await user.save();

    // if everything is ok, generate token
    const token = createToken(user._id)
    res.status(200).json({token})
})