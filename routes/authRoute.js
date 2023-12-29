const express = require('express')

const {signUpValidator, loginValidator} = require('../utils/validators/authValidator');

const {signUp, login, forgetPassord, verifyPassResetCode, resetPassword } = require('../services/authService');

const router = express.Router();


router.route('/signup').post(signUpValidator, signUp );
router.route('/login').post(loginValidator, login );
router.route('/forgetPassword').post( forgetPassord );
router.route('/verifyResetCode').post( verifyPassResetCode);
router.route('/resetPassword').put( resetPassword);
module.exports = router;