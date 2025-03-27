import { check } from 'express-validator'
import { checkFileIsImage, checkFileMaxSize } from './FileValidationHelper.js'
const maxFileSize = 2000000 // around 2Mb

const checkDiscountCodeNotRepeatedCreate = async (discountCode, ownerId) => {
  // Create a where clause object to filter the Restaurant model. The discount code and the ownerId must match.
  const whereClause = {
    userId: ownerId, // The userId field of the Restaurant model must match the ownerId parameter.
    discountCode: discountCode // The discountCode field of the Restaurant model must match the discountCode parameter.
  }
  // Use the Restaurant model's count method to count the number of restaurants that match the where clause.
  // The count method returns a Promise that resolves to the number of matching restaurants.
  const numberRestaurantsWithSameDiscountCode = await 
  Restaurant.count({ where: whereClause // Use the where clause to filter the Restaurants.
  })
  // If the number of matching restaurants is greater than or equal to 1, throw an error indicating that the discount code is already in use.
  if (numberRestaurantsWithSameDiscountCode >= 1) {
    throw new Error('Restaurant discount codes cannot repeat among restaurants of the same owner.');
  }
  // If no matching restaurants are found, return true to indicate that the discount code is not repeated.
  return true
}

const checkDiscountCodeNotRepeatedUpdate = async (discountCode, ownerId, restaurantId) => {
  // Create a where clause object to filter the Restaurant model. The discount code and the ownerId must match.
  const whereClause = {userId: ownerId, // The userId field of the Restaurant model must match the ownerId parameter.
  discountCode: discountCode, // The discountCode field of the Restaurant model must match the discountCode parameter.
  // If a restaurantId is provided, it means we are updating a restaurant, so we need to exclude the current restaurant.
  // We add a condition to the where clause to exclude the current restaurant.
  id: { [Sequelize.Op.ne]: restaurantId }
  }
  // Use the Restaurant model's count method to count the number of restaurants that match the where clause.
  // The count method returns a Promise that resolves to the number of matching restaurants.
  const numberRestaurantsWithSameDiscountCode = await  Restaurant.count({
  where: whereClause // Use the where clause to filter the Restaurants.
  })
  // If the number of matching restaurants is greater than or equal to 1, throw an error indicating that the discount code is already in use.
  if (numberRestaurantsWithSameDiscountCode >= 1) { 
    throw new Error('Restaurant discount codes cannot repeat among restaurants of the same owner.');
  }
  // If no matching restaurants are found, return true to indicate that the discount code is not repeated.
  return true
  }

const create = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('postalCode').exists().isString().isLength({ min: 1, max: 255 }),
  check('url').optional({ nullable: true, checkFalsy: true }).isString().isURL().trim(),
  check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
  check('email').optional({ nullable: true, checkFalsy: true }).isString().isEmail().trim(),
  check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim(),
  check('restaurantCategoryId').exists({ checkNull: true }).isInt({ min: 1 }).toInt(),
  check('userId').not().exists(),
  check('heroImage').custom((value, { req }) => {
    return checkFileIsImage(req, 'heroImage')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('heroImage').custom((value, { req }) => {
    return checkFileMaxSize(req, 'heroImage', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('logo').custom((value, { req }) => {
    return checkFileIsImage(req, 'logo')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('logo').custom((value, { req }) => {
    return checkFileMaxSize(req, 'logo', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('discountCode').optional({ nullable: true, checkFalsy: true
  }).isString().isLength({ min: 1, max: 10 }).trim(),
  check('discount').optional({ nullable: true, checkFalsy: true
  }).isFloat({ min: 0, max: 99 }).toFloat(),
  check('discountCode').custom((value, { req }) => {
  return checkDiscountCodeNotRepeatedCreate(value, req.user.id)
  }).withMessage('Restaurant discount codes cannot repeat among restaurants of the same owner.')
]
const update = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('postalCode').exists().isString().isLength({ min: 1, max: 255 }),
  check('url').optional({ nullable: true, checkFalsy: true }).isString().isURL().trim(),
  check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
  check('email').optional({ nullable: true, checkFalsy: true }).isString().isEmail().trim(),
  check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim(),
  check('restaurantCategoryId').exists({ checkNull: true }).isInt({ min: 1 }).toInt(),
  check('userId').not().exists(),
  check('heroImage').custom((value, { req }) => {
    return checkFileIsImage(req, 'heroImage')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('heroImage').custom((value, { req }) => {
    return checkFileMaxSize(req, 'heroImage', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('logo').custom((value, { req }) => {
    return checkFileIsImage(req, 'logo')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('logo').custom((value, { req }) => {
    return checkFileMaxSize(req, 'logo', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('discountCode').optional({ nullable: true, checkFalsy: true
  }).isString().isLength({ min: 1, max: 10 }).trim(),
  check('discount').optional({ nullable: true, checkFalsy: true
  }).isFloat({ min: 0, max: 99 }).toFloat(),
  check('discountCode').custom((value, { req }) => {
  return checkDiscountCodeNotRepeatedUpdate(value, req.user.id, req.params.restaurantId)
  }).withMessage('Restaurant discount codes cannot repeat among restaurants of the same owner.')
]

export { create, update }
