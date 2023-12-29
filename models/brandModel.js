const mongoose = require('mongoose')

// 1 Create Schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand requird'],
        unique: [true , 'Brand must be uniqe'],
        minlength: [3, 'Too Short Brand name'],
        maxlength: [20, 'Too long Brand name'],
    },

    // this name Catg A and b Convert => Shoping.com/a-and-b
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
}, 
{timestamps: true}
)


const setImageURL = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`
        doc.image = imageUrl
    }
}
// has been initialized from the db
brandSchema.post('init', (doc) =>{
    setImageURL(doc)
   
  });

  // has been saved
  brandSchema.post('save', (doc) =>{
    setImageURL(doc)
   });
// 2 Create Model
module.exports = mongoose.model('Brand',  brandSchema)

 