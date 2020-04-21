const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')
const md5 = require('md5')
class ClientController extends BaseController {
  constructor() {
    super(mongoose)
  }


  async getAll(req, res) {
    let sql_1 = "CALL proc_viewUser(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['', 'KH', '', 1, 1000, 'ID_TaiKhoan', 'giam'])

    let numberRow = { count: 0 }
    if (result_1.length > 0) numberRow = getRowsPagination(result_1[result_1.length - 1])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })
    if (numberRow.count === 0) return res.status(422).send({
      success: false,
      message: "Lấy thông tin thất bại!!!"
    })

    console.log("-Lấy thông tin user thành công!!!")

    res.send({
      data: result_1[0],
      success: true,
      message: "Lấy thông tin user thành công!!!"
    })
  }

  async create(req, res) {
    let { username, password, name, gmail, sdt } = req.body

    // kiểm tra user có tồn tại ko
    let sql_1 = "CALL proc_viewUser(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', '', 1, 1, 'ID_TaiKhoan', 'tang'])

    let numberRow = { count: 0 }
    if (result_1.length > 0) numberRow = getRowsPagination(result_1[result_1.length - 1])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    if (numberRow.count === 1) return res.status(402).send({
      success: false,
      message: "User này đã tồn tại trong hệ thống!"
    })

    console.log("-Kiểm tra user thành công!!!")

    // đăng kí tài khoản
    let hashpass = md5(password)
    let sql_2 = "CALL proc_DangKy(?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_2, [result_2, fields_2]] = await queryDB(sql_2, [username, hashpass, name, gmail, sdt])

    let { state, message } = getStateMessage(result_2[result_2.length - 1])

    if (err_2) return res.status(422).send({
      success: false,
      message: err_2
    })

    if (!state) return res.status(422).send({
      success: false,
      message: message
    })

    console.log("-Đăng ký user thành công!!!")

    res.send({
      success: true,
      message: message
    })
  }

  async getInfoByTKTT(req, res) {
    const {id} = req.params
    let sql_1 = "CALL proc_viewTTTKRaUser(?, @kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [id])
    console.log(result_1)
    let numberRow = { count: 0 }
    if (result_1.length > 0) numberRow = getRowsPagination(result_1[result_1.length - 1])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })
    if (numberRow.count === 0) return res.status(422).send({
      success: false,
      message: "Lấy thông tin thất bại!!!"
    })

    console.log("-Lấy thông tin user thành công!!!")

    res.send({
      data: result_1[0],
      success: true,
      message: "Lấy thông tin user thành công!!!"
    })
  }
}

module.exports = ClientController