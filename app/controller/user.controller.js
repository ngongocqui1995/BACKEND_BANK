const BaseController = require('./base.controller')
const mongoose = require('mongoose')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
var md5 = require('md5');

class UserController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async listgiaodich(req, res) {
    let { accesstoken } = req

    if (isEmpty(accesstoken)) {
      return res.status(401).send({
        success: false,
        message: "-Lấy token thất bại !!!"
      })
    }

    if (!accesstoken.atoken) {
      return res.status(401).send({
        success: false,
        message: "-Lấy token thất bại !!!"
      })
    }

    // lấy danh sách giao dịch
    let sql_1 = "CALL proc_viewUserDSGiaoDichNo(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accesstoken.username, '', '', 1, 10000, 'ThoiGian', 'giam'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    console.log("-Lấy danh sách giao dịch thành công!!!")

    res.send({
      user: result_1 ? result_1[0] ? result_1[0] : [] : [],
      success: true,
      message: "Lấy danh sách giao dịch thành công!!!"
    })
  }

  async giaodichdoino(req, res) {
    let { accesstoken } = req
    let { soTaiKhoan, tenNganHang, soTien, loaiGiaoDich, ghiChu } = req.body

    if (isEmpty(accesstoken)) {
      return res.status(401).send({
        success: false,
        message: "-Lấy token thất bại !!!"
      })
    }

    if (!accesstoken.atoken) {
      return res.status(401).send({
        success: false,
        message: "-Lấy token thất bại !!!"
      })
    }

    // chuyển tiền nội bộ
    let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accesstoken.ClientID, 'BBC', soTaiKhoan, tenNganHang, soTien, loaiGiaoDich, ghiChu, 'A', ''])

    let { state, message } = getStateMessage(result_1[result_1.length - 1])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })
    if (!state) return res.status(422).send({
      success: false,
      message: message
    })
    console.log("-Chuyển tiền nội bộ thành công!!!")

    res.send({
      success: true,
      message: message
    })
  }

  async update(req, res) {
    let { accesstoken } = req
    let { name, gmail, sdt } = req.body

    if (isEmpty(accesstoken)) {
      return res.status(401).send({
        success: false,
        message: "-Lấy token thất bại !!!"
      })
    }

    if (!accesstoken.atoken) {
      return res.status(401).send({
        success: false,
        message: "-Lấy token thất bại !!!"
      })
    }

    // sửa tài khoản
    let sql_1 = "CALL proc_SuaTaiKhoan(?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accesstoken.username, name, gmail, sdt])

    let { state, message } = getStateMessage(result_1[result_1.length - 1])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })
    if (!state) return res.status(422).send({
      success: false,
      message: message
    })

    console.log("-Sửa user thành công!!!")

    res.send({
      success: true,
      message: message
    })
  }

  async info(req, res) {
    const { username } = req.params

    // lấy thông tin user
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


    let userInfo = result_1[0] ? result_1[0][0] : {}

    res.send({
      data: userInfo,
      success: true,
      message: "Lấy thông tin user thành công!!!"
    })
  }

  async getAll(req, res) {

    // lấy tất cả tài khoản ngân hàng
    let sql_1 = "CALL proc_viewTaiKhoanTTTK(?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['', '', '', '', 1, 10000, 'ID_TaiKhoanTTTK', 'tang'])

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

    res.send({
      user: result_1 ? result_1[0] ? result_1[0] : [] : [],
      success: true,
      message: "Lấy user thành công!!!"
    })
  }

  async getAccountByType(req, res) {
    let { type, username } = req.params

    if(type === 'all') type = '' // set default is get all

    const sql_1 = "CALL proc_viewTaiKhoanTTTK(?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    const [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username,'', type, '', 1, 10000, 'ID_TaiKhoanTTTK', 'giam'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    console.log("-Lấy user thành công!!!")

    res.send({
      data: result_1 ? result_1[0] ? result_1[0] : [] : [],
      success: true,
      message: "Lấy user thành công!!!"
    })
  }
}

module.exports = UserController