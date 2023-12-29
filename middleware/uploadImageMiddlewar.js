const multer = require('multer')

const ApiError = require('../utils/apiError');

const multerOptions = () => {
      // 1- DiskStorage Engine
// const storage = multer.diskStorage({
//     destination: function (req, file , cb) {
//         cb(null , 'uploads/categories')
//     },
//     filename: function (req, file, cb) {
//         const ext = file.mimetype.split('/')[1]
//         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
//         cb(null , filename)
//         }
// }) 

    // Memory Storge Engine
const storage = multer.memoryStorage()

const fileFilter = function(req, file, cb) {
    if(file.mimetype.startsWith('image')) {
        cb(null, true)
    }else{
        cb(new ApiError('Only Images Allowed', 400), false)
    }
} 
const upload = multer({ storage: storage, fileFilter: fileFilter})
return upload;
}

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName)


exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields)