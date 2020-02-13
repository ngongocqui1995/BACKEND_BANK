const BaseController = require('./base.controller')
const mongoose = require('mongoose')
const ProductBis = require('../bussiness-logic/product.bis')

class ProductController extends BaseController {
  constructor() {
    super(mongoose)
    this.productBis = new ProductBis(mongoose)
  }

  async getAll(req, res) {

    const [err, result] = await this.to(this.productBis.getAll({}, 1, 10))
    if (err) this.ReE((res, err))

    return this.ReS(res, result)
  }
}

module.exports = ProductController