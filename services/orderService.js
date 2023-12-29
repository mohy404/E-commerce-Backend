const stripe = require('stripe')(process.env.STRIPE_SECRET)
const asyncHandler = require('express-async-handler');

const factory = require('./HandlerFactory')
const ApiError = require('../utils/apiError');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

//@desc  create cash order
//@route POST /api/vi/orders/cartId
//@access Private (User)
// الدفع كاش عند التوصيل 
exports.createCashOrder = asyncHandler(async (req, res, next) =>{
    const taxPrice = 0
    const shippingPrice = 0
    // 1- Get cart depend on cartId
    const cart = await Cart.findById(req.params.cartId)
    if (!cart) {
        throw new ApiError(404, 'Cart not found!')
    }
    // 2- Get order price depend on cart price "Check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice

    // 3- Create order with default paymentMethoudType cash
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice,
    })
    // 4- After creating order, decrement product quantity, increment product sold
    if (order) {
        const bulkOtion = cart.cartItems.map((item) => ({
            updateOne: {
                filter:{ _id: item.product},
                update: { $inc: {quantity: -item.quantity ,sold: +item.quantity} }
            }
        }))
        await Product.bulkWrite(bulkOtion, {})

        // 5- Clear cart depend on cartId
        await Cart.findByIdAndDelete(req.params.cartId)
    }
    res.status(201).json({ status: 'Success', data: order})
})

// Create Middlware
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next)=>{
    if (req.user.role === 'user') req.filterObj = {user: req.user._id}
    else req.filterObj = {}
    next()
})

//@desc  Get all Orders
//@route GET /api/vi/orders
//@access Private Admin-user-manager
exports.findAllOrders = factory.getAll(Order)

//@desc Get specific orders
//@route GET /api/v1/orders/:id
//@access Private user
exports.findOrderByID = factory.getOne(Order)

//@desc Update order paid status to paid
//@route PUT /api/v1/orders/:id/paid    
//@access Private admin-manager
exports.updatePaidStatusToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    // Check for order existence
    if (!order) return next(new ApiError(`No Order found with this Id :${req.params.id}`, 404))
    // Only allow admins and the owner of the order to mark an order as 
    order.isPaid = true
    order.paidAt = Date.now()

    const updatedOrder = await order.save()

    res.status(200).json({ status: 'success', data: updatedOrder})
})

//@desc Update order delivered status 
//@route PUT /api/v1/orders/:id/deliver   
//@access Private admin-manager
exports.updateDeliverdStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    // Check for order existence
    if (!order) return next(new ApiError(`No Order found with this Id :${req.params.id}`, 404))
    // Only allow admins and the owner of the order to mark an order as 
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.status(200).json({ status: 'success', data: updatedOrder})
})

//@desc Get checkout session from stripe and send it as response 
//@route GET /api/v1/orders/checkout-session/cartId
//@access Protected/User 
// الدفع عن طريق credit card Online
exports.checkOutSession = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
  
    // 1- Get cart depend on cartId
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      throw new ApiError(404, 'Cart not found!');
    }
  
    // 2- Get order price depend on cart price "Check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
  
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  
    // 3) Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: req.user.name,
              description: 'Order From My Store'
            },
            unit_amount: totalOrderPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/orders`,
      cancel_url: `${req.protocol}://${req.get('host')}/cart`,
      customer_email: req.user.email,
      client_reference_id: req.params.cartId,
      metadata: req.body.shippingAddress,
    });
  
    // 4) send session to response
    res.status(200).json({ status: 'success', session });
  });

  exports.webhookCheckout = asyncHandler(async(req, res, next) => {
        const sig = req.headers['stripe-signature'];
      
        let event;
      
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
         return  res.status(400).send(`Webhook Error: ${err.message}`)
         }
         // Handle the checkout.session.completed event
         if (event.type === 'checkout.session.completed') {
            console.log('Create order Here.....')
         }
  })
  