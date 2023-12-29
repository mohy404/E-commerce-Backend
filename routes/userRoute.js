const express = require('express')

const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changePasswordValidator,
    updateLoggedUserValidator
} = require('../utils/validators/userValidator');

const {
 getUsers,
 getUser,
 createUser,
 updateUser,
 deleteUser,
 uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactiveLoggedUserAccount
} = require('../services/userService');

const authService = require('../services/authService')

const router = express.Router();

router.use(authService.protect)

router.get('/getMe', getLoggedUserData, getUser)
router.put('/changeMypassword', updateLoggedUserPassword)
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData)
router.delete('/deleteMe', deactiveLoggedUserAccount)

// Admin
router.use( authService.allowedTo("admin", "manager"))

router.put('/changePassword/:id', 
changePasswordValidator,
changeUserPassword)


router.route('/')
.get(
getUsers)
.post(  
uploadUserImage,
resizeImage ,
createUserValidator,
createUser);
router
  .route('/:id')
  .get(
    getUserValidator,getUser)
  .put(
    uploadUserImage,
    resizeImage, 
    updateUserValidator,
    updateUser)
  .delete(
    deleteUserValidator, deleteUser);

module.exports = router;