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

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    // const message = result_1[1][0].message
    // const split = message.split(':')
    // console.log(split)
    // if (split[0] != 0) {
    //   return res.status(422).send({
    //     success: false,
    //     result_code: +split[0],
    //     message: split[1]
    //   })
    // }

    res.send({
      data: result_1[0],
      success: true,
      result_code: 0,
      message: "Lấy thông tin user thành công!!!"
    })
  }

  async create(req, res) {
    let { username, password, name, gmail, sdt } = req.body

    // kiểm tra user có tồn tại ko
    let sql_1 = "CALL proc_viewUser(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', '', 1, 1, 'ID_TaiKhoan', 'tang'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message = result_1[1][0] && result_1[1][0].message || ''
    const split = message.split(':')
    console.log(split)
    if (split[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split[0],
        message: split[1]
      })
    }

    // đăng kí tài khoản
    let hashpass = md5(password)
    let sql_2 = "CALL proc_DangKy(?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_2, [result_2, fields_2]] = await queryDB(sql_2, [username, hashpass, name, gmail, sdt])

    if (err_2) return res.status(422).send({
      success: false,
      message: err_2
    })

    const message2 = result_2[1][0] && result_2[1][0].message || ''
    const split2 = message2.split(':')
    console.log(split2)
    if (split2[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split2[0],
        message: split2[1]
      })
    }

    console.log("-Đăng ký user thành công!!!")

    let sql_3 = "CALL proc_ThemAuth_RefreshToken(?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_3, [result_3, fields_3]] = await queryDB(sql_3, [username, '', '', 'thang', 12])
    const message3 = result_3[1][0] && result_3[1][0].message || ''
    const split3 = message3.split(':')
    console.log(split3)
    if (split3[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split3[0],
        message: split3[1]
      })
    }

    res.send({
      success: true,
      result_code: 0,
      message: "Đăng ký thành công!"
    })
  }

  async getInfoByTKTT(req, res) {
    const { id } = req.params
    let sql_1 = "CALL proc_viewTTTKRaUser(?, @kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [id])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message = result_1[1][0] && result_1[1][0].message || ''
    const split = message.split(':')
    
    if (split[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split[0],
        message: split[1]
      })
    }

    res.send({
      data: result_1[0],
      success: true,
      result_code: 0,
      message: "Lấy thông tin user thành công!"
    })
  }
}

module.exports = ClientController