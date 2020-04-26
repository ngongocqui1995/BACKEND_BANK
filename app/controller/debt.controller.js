const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')

class DebtController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async getOneByUser(req, res) {
    const {username} = req.params
    
    let sql_1 = "CALL proc_viewUserDSGiaoDichNo(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', '', 1, 100, 'ThoiGian','giam'])
    
    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message1 = result_1[1][0] && result_1[1][0].message || ''
    const split1 = message1.split(':')
    console.log(split1)
    if (split1[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split1[0],
        message: split1[1]
      })
    }
    
    res.send({
      data: result_1[0],
      success: true,
      message: "Lấy thông tin user thành công!!!"
    })
  }

  async create(req, res) {
    let {accountNumberA, accountNumberB, amount, note, payer} = req.body

    let sql = "CALL proc_viewTTTKRaUser(?, @kq); select @kq as `message`;";
    let [err, [result, fields]] = await queryDB(sql, [accountNumberB])

    if (err) return res.status(422).send({
      success: false,
      message: err
    })

    const message = result[1][0] && result[1][0].message || ''
    const split = message.split(':')
    console.log(split)
    if (split[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split[0],
        message: split[1]
      })
    }
 
    // chuyển tiền nội bộ
    let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accountNumberA, 'BBC', accountNumberB, 'BBC', amount, 'Doi', note, payer, ''])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message1 = result_1[1][0] && result_1[1][0].message || ''
    const split1 = message1.split(':')
    console.log(split1)
    if (split1[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split1[0],
        message: split1[1]
      })
    }

    const username = result[0][0].Username
    const io = req.app.get('socketio');
    io.emit('DEBT_NOTICE', {username, accountNumberA, accountNumberB, amount, note, payer});
    
    res.send({
      success: true,
      result_code: 0,
      message: split1[1]
    })
  }

  async removeDebt(req, res) {
    const {id} = req.params
    const {Username_IN, GhiChu_IN} = req.body
    console.log(req.body)

    let sql_1 = "CALL proc_XoaDoi(?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [Username_IN, id, GhiChu_IN])

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
      success: true,
      message: split[1]
    })
  }
}

module.exports = DebtController