const mongoose = require('mongoose')


// 1 Create Schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product requird'],
        trim: true,
        minlength: [3, 'Too Short Product Title'],
        maxlength: [90, 'Too long Product Title'],
    },
    slug: {
        type: String,
        lowercase: true,
        required: true ,
    },
    description: {
        type: String,
        required: [true, 'Product requird'],
        minlength: [20, 'Too Short Product Description'],
    },
    quantity: {
        type: Number,
        required: [true , 'Product quantity is required']
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
        max: [200000, 'Too long Product Price'],
    },
    priceAfterDiscount: {
        type: Number,
    },
    colors: [String],

    imageCover: {
    type: String,
    required: [true, 'Product Image cover is requird'],
    },
    images: [String],

    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product must be belong to Category'],
    },
    subcategories: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'SubCategory',
        }
    ],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
    },
    ratingsAverage :{
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be below or equal 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    }
},
 { timestamps: true,
  // to enable virtual populate
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
)


productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
})

// Mongoose Query middleware
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: 'name -_id'
    })
    next()
})

const setImageURL = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`
        doc.imageCover = imageUrl
    }

    if (doc.images) {
        const imagesList =[]
        doc.images.forEach((image) => {
            const imageUrl =  `${process.env.BASE_URL}/products/${image}`
            imagesList.push(imageUrl)
        })
        doc.images = imagesList
    }
}
// has been initialized from the db
productSchema.post('init', (doc) =>{
    setImageURL(doc)
   
  });

  // has been saved
  productSchema.post('save', (doc) =>{
    setImageURL(doc)
   });
// 2 Create Model
module.exports = mongoose.model('Product', productSchema)
