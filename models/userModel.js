const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: { type: String,
    trime: true, 
    required: [true, 'name required'], 
},
slug: {
    type: String,
    lowercase: true,
},
email : {
    type: String,
    requierd: [true, 'email required'],
    unique: true,
    lowercase: true,

},
phone :  String,
profileImg: String,

password: {
    type: String,
    required : [true, 'Password requird'],
    minlength: [6, "Password should be at least 6 characters"],
},

passwordChangedAt: Date,
passwordResetCode: String,
activeAccountToken: Date,
isActive: Boolean,

role: {
    type: String,
    enum: ['admin', 'manager' ,'user'],
    default: 'user'
},

active: {
    type: Boolean,
    default: true,
},
    // child reference (one to many)
wishlist: [
    {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
    }
],
addresses: [
    {
      id: {type:mongoose.Schema.Types.ObjectId},
      alias: String,
      details: String,
      phone: String,
      city:String,
      postalCode: String
    }
],
}, {timestamps: true})

// Hashing user password 
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
})

const User = mongoose.model('User', userSchema)

module.exports = User