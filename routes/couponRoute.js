const express = require('express');

const {
 getCoupnos,
 getCoupon,
 createCoupon,
 updateCoupon,
 deleteCoupon,
} = require('../services/couponeService');

const authService = require('../services/authService')

const router = express.Router();

router.use(authService.protect, authService.allowedTo("admin", "manager"),)

router.route('/').get(getCoupnos).post(createCoupon);
router.route('/:id').get( getCoupon ).put(updateCoupon).delete(deleteCoupon);

module.exports = router;