const BaseController = require('./base.controller')
const mongoose = require('mongoose')
const AuthBis = require('../bussiness-logic/auth.bis')
const { isEmail, isEmpty, getStateMessage, getRowsPagination } = require('../validator/validator')
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
      return this.ReE(res, {
        success: false,
        message: "Đăng nhập thất bại !!!"
      })
    }

    // kiểm tra đăng nhập thành công hay thất bại
    let hashPassword = md5(password)
    let sql = "CALL proc_DangNhap(?,?,@kq); select @kq as `message`;";
    let [err, [result, fields]] = await queryDB(sql, [username, hashPassword])
    
    let { state, message } = getStateMessage(result[result.length-1])
    
    if(err) return this.ReE(res, {
      success: false,
      message: err
    })
    if(!state) return this.ReE(res, {
      success: false,
      message: message
    })

    // lấy thông tin user
    let sql_1 = "CALL proc_viewUser(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', '', 1, 1, 'ID_TaiKhoan', 'tang'])
    
    let numberRow = { count: 0 }
    if (result_1.length > 0) numberRow = getRowsPagination(result_1[result_1.length-1])

    if(err_1) return this.ReE(res, {
      success: false,
      message: err_1
    })
    if(numberRow.count === 0) return this.ReE(res, {
      success: false,
      message: "Đăng nhập thất bại !!!"
    })

    let user = result_1[0] ? result_1[0][0] : {}

    // lấy accesstoken và refreshToken
    const [err_2, auth] = await this.to(this.authBis.authUser(user))
    if(err_2) return this.ReE(res, {
      success: false,
      message: err_2
    })

    // lưu refreshToken vào db
    let sql_3 = "CALL  proc_ThemAuth_RefreshToken(?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_3, [result_3, fields_3]] = await queryDB(sql_3, [username, user.ID_TaiKhoan, auth.refreshToken, 'thang', '1'])
    let { state_3, message_3 } = getStateMessage(result_3[result_3.length-1])

    if(err_3) return this.ReE(res, {
      success: false,
      message: err_3
    })
    if(!state_3) return this.ReE(res, {
      success: false,
      message: message_3
    })
    
    return this.ReS(res, auth)
  }
}

module.exports = AuthController