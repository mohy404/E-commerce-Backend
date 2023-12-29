const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true , 'Subcategory Must be Uniqe'],
       minlenght: [2, 'To Short SubCategory name'],
       maxlength:[20,'Maximum 20 characters']
    },

    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Please add a Category']
    }
} 
, {timestamps: true})

module.exports = mongoose.model('SubCategory', subCategorySchema)