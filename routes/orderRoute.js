const express = require('express');

const {
 createCashOrder,
 findAllOrders, 
 findOrderByID,
 filterOrderForLoggedUser,
 updatePaidStatusToPaid,
 updateDeliverdStatus,
 checkOutSession
} = require('../services/orderService');

const authService = require('../services/authService')

const router = express.Router();

router.use(authService.protect)

router.get('/checkout-session/:cartId', authService.allowedTo('user'), checkOutSession)

router.route('/:cartId').post(authService.allowedTo('user'), createCashOrder)
router.get(
    '/',
    authService.allowedTo( 'user','admin', 'manager'),
    filterOrderForLoggedUser,
    findAllOrders,
)
router.get('/:id', findOrderByID)

router.put('/:id/pay', authService.allowedTo('admin', 'manager'), updatePaidStatusToPaid)
router.put('/:id/deliver', authService.allowedTo('admin', 'manager'), updateDeliverdStatus)

module.exports = router;