const {check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatoreMiddleware')

exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory ID Format'), 
    validatorMiddleware,
]

exports.createSubCategoryValidator = [
    check('name', 'Name is required')
    .notEmpty().withMessage("Catgory requird")
    .isLength({min: 2})
    .withMessage('Too Short Catogery name')
    .isLength({max: 20})
    .withMessage("Too long Subcategory name"),
    check('category')
    .notEmpty()
    .withMessage('SubCategory must be belong to category')
    .isMongoId()
    .withMessage('Invalid SubCategory Category Name'),
    validatorMiddleware,
]

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory ID Format'), 
    validatorMiddleware,
]

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory ID Format'), 
    validatorMiddleware,
]