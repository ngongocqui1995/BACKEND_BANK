const BaseController = require('./base.controller')
const mongoose = require('mongoose')
const AuthBis = require('../bussiness-logic/auth.bis')
const { isEmail, isEmpty, getStateMessage } = require('../validator/validator')
const { queryDB } = require('../../config/dev/db_mysql')
const md5 = require('md5')

class AuthController extends BaseController {
  constructor() {
    super(mongoose)
    this.authBis = new AuthBis(mongoose)
  }

  async login(req, res) {
    let username = req.body.username
    let password = req.body.password

    if (!isEmail(username) || isEmpty(password)) {
      this.ReE(res, 422)
    }

    let hashPassword = md5(password)
    let sql = "CALL `proc_DangNhap`(?,?,@kq); select @kq as `message`;";
    let [err, [result, fields]] = await queryDB(sql, [username, hashPassword])
    let { state, message } = getStateMessage(result[result.length-1])
    
    if(err) return this.ReE(res, 422)
    if(!state) return this.ReE(res, 422)

    const [err_1, auth] = await this.to(this.authBis.authUser({username}))
    if(err_1) return this.ReE(res, 422)

    return this.ReS(res, auth)
  }
}

module.exports = AuthController