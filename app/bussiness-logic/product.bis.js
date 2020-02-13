const BaseBis = require('./base.bis')
const ProductModel = require('../models/product.model')

class ProductBis extends BaseBis {
  constructor(mongoose) {
    super()
    this.productModel = ProductModel(mongoose)
  }

  async getAll(filter = {}, page = 1, limit = 10) {
    const [err, result] = await this.to(this.productModel.paginate( filter, {
      page,
      limit
    }))
    if(err) this.TE(err)

    return result
  }
}

module.exports = ProductBis