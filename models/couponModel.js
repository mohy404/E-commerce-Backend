const mongoose = require('mongoose')

const couponeSchema = new mongoose.Schema({
 name: {
    type: String,
    trim: true,
    required: [true ,'Coupone is required'],
    unique: true
 },
 expire: {
    type: Date,
   //  default :Date.now() + 86400000, //1 day in ms
    required: [true, 'Coupone expire time required'],
 },
 discount: {
    type: Number,
    required: [true,'Discount value is required']
 }
}, 
{timestamps: true }
)

module.exports = mongoose.model('Coupon', couponeSchema)
