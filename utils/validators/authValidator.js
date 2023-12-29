const slugify = require('slugify');
const { check } = require('express-validator');

const validatorMiddleware = require('../../middleware/validatoreMiddleware');
const User = require('../../models/userModel');

exports.signUpValidator = [
  check('name')
    .notEmpty()
    .withMessage('User required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom((val) =>
     User.findOne({ email: val}).then((user) => {
        if (user){
            throw new Error ('This Email is already in use');
     }
    })
    ),

    //check password
    check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({min: 6})
    .withMessage('Please enter a valid password')
    .custom((password, {req}) => {
        if(password !== req.body.passwordConfirm){
            throw new Error("Passwords do not match")
    }
    return true
    }),

    check('passwordConfirm').notEmpty().withMessage('Please Confrmation Required'),

  validatorMiddleware,
];

exports.loginValidator = [
    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Please enter a valid email address'),

    //check password
    check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({min: 6})
    .withMessage('Please enter a valid password'),

  validatorMiddleware,
];
