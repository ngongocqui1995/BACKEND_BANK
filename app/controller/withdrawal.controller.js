const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const moment = require('moment')

class WithdrawalController extends BaseController {
  constructor() {
    super()
  }

  async create(req, res) {
    let { SoTKGui, SoTKNhan, SoTien, NguoiTraPhi, MoTa, key_message, key_signature } = req.body
    let {agent_code} = req.headers
    console.log(key_signature)
    // chuyển tiền nội bộ
    let sql_1 = "CALL proc_GiaoDichDoiNo_LienKet(?,?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [SoTKGui, 'BBC', SoTKNhan, agent_code, SoTien, 'Gui', MoTa, NguoiTraPhi, '', key_signature])

    console.log(result_1[1][0])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message = result_1[1][0] && result_1[1][0].message || ''
    const split = message.split(':')
    console.log(split)
    if (split[0] != 0) {
      return res.status(422).send({
        SoTKGui,
        SoTKNhan,
        SoTien,
        NguoiTraPhi,
        result_code: 1,
        timestamp: moment().format("YYYYMMDDHHmmss").valueOf(),
        key_message,
        key_signature,
        message: 'Yêu cầu thất bại!'
      })
    }

    res.send({
      MaGD: split[2],
      SoTKGui,
      SoTKNhan,
      SoTien,
      NguoiTraPhi,
      result_code: 0,
      timestamp: moment().format("YYYYMMDDHHmmss").valueOf(),
      key_message,
      key_signature,
      message: 'Giao dịch thành công!'
    })
  }
}

module.exports = WithdrawalController