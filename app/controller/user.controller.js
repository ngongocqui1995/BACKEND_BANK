const BaseController = require('./base.controller')
const mongoose = require('mongoose')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
var md5 = require('md5');

class UserController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async create(req, res) {
    let { accesstoken, refreshtoken } = req
    let { username, password, name, gmail, sdt } = req.body

    if (isEmpty(accesstoken) || isEmpty(refreshtoken)) {
      return res.send({
        success: false,
        message: "-Lấy token thất bại !!!"
      })
    }

    // đăng kí tài khoản
    let hashpass = md5(password)
    let sql_1 = "CALL proc_DangKy(?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, hashpass, name, gmail, sdt])
    
    let { state, message } = getStateMessage(result_1[result_1.length-1])
        
    if(err_1) return res.send({
      success: false,
      message: err_1
    })
    if(!state) return res.send({
      success: false,
      message: message
    })

    console.log("-Đăng ký user thành công!!!")

    res.send({
        success: true,
        message: message
    })
  }

  async info(req, res) {
    let { accesstoken, refreshtoken } = req

    if (isEmpty(accesstoken) || isEmpty(refreshtoken)) {
      return res.send({
        success: false,
        message: "-Lấy token thất bại !!!"
      })
    }

    // lấy thông tin user
    let sql_1 = "CALL proc_viewUser(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accesstoken.username, '', '', 1, 1, 'ID_TaiKhoan', 'tang'])
    
    let numberRow = { count: 0 }
    if (result_1.length > 0) numberRow = getRowsPagination(result_1[result_1.length-1])

    if(err_1) return res.send({
      success: false,
      message: err_1
    })
    if(numberRow.count === 0) return res.send({
      success: false,
      message: "Lấy thông tin thất bại!!!"
    })

    console.log("-Lấy thông tin user thành công!!!")

    let userInfo = result_1[0] ? result_1[0][0] : {}

    res.send({
        user: userInfo,
        success: true,
        message: "Lấy thông tin user thành công!!!"
    })
  }

  async getAll(req, res) {
    let { accesstoken, refreshtoken } = req

    if (isEmpty(accesstoken) || isEmpty(refreshtoken)) {
      return res.send({
        success: false,
        message: "-Lấy token thất bại !!!"
      })
    }

    // lấy tất cả tài khoản ngân hàng
    let sql_1 = "CALL proc_viewTaiKhoanTTTK(?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accesstoken.username, '', '', '', 1, 10000, 'ID_TaiKhoanTTTK', 'tang'])
    
    let numberRow = { count: 0 }
    if (result_1.length > 0) numberRow = getRowsPagination(result_1[result_1.length-1])

    if(err_1) return res.send({
      success: false,
      message: err_1
    })
    if(numberRow.count === 0) return res.send({
      success: false,
      message: "Lấy thông tin thất bại!!!"
    })

    console.log("-Lấy user thành công!!!")

    res.send({
        user: result_1[0] ? result_1[0] : [],
        success: true,
        message: "Lấy user thành công!!!"
    })
  }
}

module.exports = UserController