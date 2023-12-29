const slugify = require('slugify');
const { check, body } = require('express-validator');
const bcrypt = require('bcrypt')


const validatorMiddleware = require('../../middleware/validatoreMiddleware');
const User = require('../../models/userModel');

exports.createUserValidator = [
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

    check('phone').optional().isMobilePhone(['ar-EG', 'ar-SA' , 'ar-IQ'])
    .withMessage('Please enter a valid phone number'),

    check('profileImg').optional(),
    check('role').optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
  ];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name').optional().custom((val, { req }) => {
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
  check('phone').optional().isMobilePhone(['ar-EG', 'ar-SA' , 'ar-IQ'])
    .withMessage('Please enter a valid phone number'),

    check('profileImg').optional(),
    check('role').optional(),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),

  body('currentPassword')
  .notEmpty().withMessage('You must enter your current password'),

  body('passwordConfirm')
  .notEmpty().withMessage('You must enter the password confirm'),

  body('password')
  .notEmpty().withMessage('You must enter new password')
  .custom( async(val, {req}) =>{
    const user = await User.findById(req.params.id)
    if (!user) {
      throw new Error('There is no user for this id');
    }
    const isCorrectPassword = await bcrypt.compare(
      req.body.currentPassword,  
      user.password
    )
    if(!isCorrectPassword) {
      throw new Error('Incorrect current password')
    }

    if(val !== req.body.passwordConfirm){
      throw new Error("Passwords confirmation incorrect")
}
return true;
  }),
  validatorMiddleware,
]

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body('name').optional().custom((val, { req }) => {
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
  check('phone').optional().isMobilePhone(['ar-EG', 'ar-SA' , 'ar-IQ'])
    .withMessage('Please enter a valid phone number'),
  validatorMiddleware,
];