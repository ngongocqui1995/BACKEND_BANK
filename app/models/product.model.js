const mongoosePaginate = require('mongoose-paginate')
const autoIncrement = require('mongoose-auto-increment')
let ProductModel = null

module.exports = mongoose => {
  autoIncrement.initialize(mongoose)

  const ProductSchema = new mongoose.Schema({
    _id: Number,
    title: String,
    quantity: Number,
    category: String
  }, { timestamps: true, collection: 'products' })

  ProductSchema.plugin(mongoosePaginate)
  ProductSchema.plugin(autoIncrement.plugin, 'system')

  if(!ProductModel) {
    ProductModel = mongoose.model('Product', ProductSchema)
  }

  return ProductModel
}
