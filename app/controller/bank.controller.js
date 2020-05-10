const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')

class BankController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async getBankList(req, res) {
    const { username } = req.params
    // lấy thông tin user
    let sql_1 = "CALL proc_viewNH(?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['', 1, 100, 'ID_NganHangLienKet', 'giam'])

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
      message: "Lấy danh sách ngân hàng thành công!!!"
    })
  }

  async create(req, res) {
    const data = req.body
    console.log(data)

    let sql_1 = "CALL proc_ThemBietDanh(?,?,?,?, @kq)";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [data.Username_IN, data.BietDanh_IN, Number(data.ID_TaiKhoan_TTTK_B_IN), data.TenNganHang_IN])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message1 = result[1][0] && result[1][0].message || ''
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
      success: true,
      result_code: 0,
      message: "Tạo biệt danh thành công!!!"
    })
  }

  async getBankByAgentCode(req, res) {
    const { bankName } = req.params
    let sql_1 = "CALL proc_viewKeyNH(?);";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [bankName])

    if (err_1) return res.status(422).send({
      result_code: 1,
      message: err_1
    })

    return res.send({
      result_code: 0,
      data: result_1[0][0]
    })

  }

}

module.exports = BankController