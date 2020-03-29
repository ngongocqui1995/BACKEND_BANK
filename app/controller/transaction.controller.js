const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')

class TransactionController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async getAll(req, res) {
    //
    let sql_1 = "CALL proc_viewGiaoDich(?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['', '', 1, 10, 'ThoiGian','giam'])

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

  async getOne(req, res) {
    // lấy danh sách giao dịch
    const {username} = req.params
    let sql_1 = "CALL proc_viewUserDSGiaoDichNo(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', '', 1, 10000, 'ThoiGian', 'giam'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    console.log("-Lấy danh sách giao dịch thành công!!!")

    res.send({
      data: result_1 ? result_1[0] ? result_1[0] : [] : [],
      success: true,
      message: "Lấy danh sách giao dịch thành công!!!"
    })
  }

  async internalTrans(req, res) {
    let { accountNumberA, accountNumberB, amount, note, payer} = req.body

    // chuyển tiền nội bộ
    let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accountNumberA, 'BBC', accountNumberB, 'BBC', amount, 'Gui', note, payer, ''])

    console.log(result_1)

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

  async externalTrans(req, res) {
    let { accountNumberA, accountNumberB, bankConnect, amount, note, payer} = req.body
 
    // chuyển tiền nội bộ
    let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accountNumberA, 'BBC', accountNumberB, bankConnect, amount, 'Gui', note, payer, ''])

    console.log(result_1)

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

}

module.exports = TransactionController