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

  async giaodich(req, res) {
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

  async info(req, res) {
    const {username} = req.params

    // lấy thông tin user
    let sql_1 = "CALL proc_viewUser(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', '', 1, 1, 'ID_TaiKhoan', 'tang'])

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

    let userInfo = result_1[0] ? result_1[0][0] : {}

    res.send({
      user: userInfo,
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

    console.log("-Lấy user thành công!!!")

    res.send({
      user: result_1 ? result_1[0] ? result_1[0] : [] : [],
      success: true,
      message: "Lấy user thành công!!!"
    })
  }

  async danhsachnhanvien(req, res) {
    // lấy tài khoản ngân hàng của nhân viên
    let sql_1 = "CALL proc_viewTaiKhoanTTTK(?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['', 'NV', '', '', 1, 10000, 'ID_TaiKhoanTTTK', 'tang'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    console.log("-Lấy user thành công!!!")

    res.send({
      user: result_1 ? result_1[0] ? result_1[0] : [] : [],
      success: true,
      message: "Lấy user thành công!!!"
    })
  }

  async danhsachtt(req, res) {
    // lấy tài khoản ngân hàng của tt
    let sql_1 = "CALL proc_viewTaiKhoanTTTK(?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['', 'TT', '', '', 1, 10000, 'ID_TaiKhoanTTTK', 'tang'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    console.log("-Lấy user thành công!!!")

    res.send({
      user: result_1 ? result_1[0] ? result_1[0] : [] : [],
      success: true,
      message: "Lấy user thành công!!!"
    })
  }

  async danhsachtk(req, res) {
    const {username} = req.params
    // lấy tài khoản ngân hàng của tk
    let sql_1 = "CALL proc_viewTaiKhoanTTTK(?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, 'TK', '', '', 1, 10000, 'ID_TaiKhoanTTTK', 'tang'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    res.send({
      user: result_1 ? result_1[0] ? result_1[0] : [] : [],
      success: true,
      message: "Lấy user thành công!!!"
    })
  }
}

module.exports = UserController