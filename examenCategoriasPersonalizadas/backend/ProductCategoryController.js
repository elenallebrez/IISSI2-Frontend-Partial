import { ProductCategory } from '../models/models.js'
const index = async function (req, res) {
  try {
    const productCategories = await ProductCategory.findAll()
    res.json(productCategories)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async function (req, res) {
  const newCategory = RestaurantCategory.build(req.body)
  try {
    const restaurantCategories = await newCategory.save()
    res.json(restaurantCategories)
  } catch (err) {
    res.status(500).send(err)
  }
}

const ProductCategoryController = {
  index,
  create
}
export default ProductCategoryController
