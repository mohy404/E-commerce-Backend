const mongoose = require('mongoose')

// 1 Create Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Catgory requird'],
        unique: [true , 'Category must be uniqe'],
        minlength: [3, 'Too Short Catogery name'],
        maxlength: [20, 'Too long category name'],
    },

    // this name Catg A and b Convert => Shoping.com/a-and-b
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
    
}, // This to create two filds on the database updata add , create add
{timestamps: true}
)


const setImageURL = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`
        doc.image = imageUrl
    }
}
// has been initialized from the db
categorySchema.post('init', (doc) =>{
    setImageURL(doc)
   
  });

  // has been saved
  categorySchema.post('save', (doc) =>{
    setImageURL(doc)
   });

// 2 Create Model
const CategoryModel = mongoose.model('Category', categorySchema)

module.exports = CategoryModel