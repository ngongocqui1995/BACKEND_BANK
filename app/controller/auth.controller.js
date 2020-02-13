/**
 * Created by sang nguyen on 11/12/2019
 *
 */

const BaseController = require('./base.controller')
const mongoose = require('mongoose')
const AuthBis = require('../bussiness-logic/auth.bis')

class AuthController extends BaseController {
  constructor() {
    super(mongoose)
    this.authBis = new AuthBis(mongoose)
  }

  async login(req, res) {
    const [err, auth] = await this.to(this.authBis.authUser({}))
    if(err) this.ReE(res, 422)

    return this.ReS(res, auth)
  }
}

module.exports = AuthController