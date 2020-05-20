const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')
const moment = require('moment')
const fetch = require('node-fetch');
const connector = require('../../config/connector')
const { signOpenPGP } = require('../middleware/auth.mware')
const sha512 = require('js-sha512').sha512;

class CoreController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async getInfo(req, res) {
    const data = req.body
    const { agent_code, api_signature, ts } = req.headers
    const connectorUrl = connector[agent_code]
    fetch(`${connectorUrl}/truyvanthongtin`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        agent_code,
        api_signature,
        ts
      },
    })
      .then(res => res.json())
      .then(json => {
        console.log("RESPONE===", json)
        res.send(json)
      });

  }

  async cashin(req, res) {
    const { accountNumberA, accountNumberB, amount, bankNameB, note, payer, username, agentSecretKey, OTP_CODE } = req.body

    const otp = await this.getOTP(username)

    if (otp.length > 6) {
      return res.status(422).send({
        success: false,
        message: "Mã OTP đã hết thời gian!"
      })
    }

    if (otp != OTP_CODE) {
      return res.status(422).send({
        success: false,
        message: "Mã xác nhận OTP không đúng!"
      })
    }

    // kiểm tra coi có đủ tiền chưa ?
    let sql_1 = "CALL proc_viewTTTKRaUser(?, @kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accountNumberA])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message = result_1[1][0] && result_1[1][0].message || ''
    const split = message.split(':')

    if (split[0] != 0) {
      return res.status(422).send({
        result_code: +split[0],
        message: split[1],
        timestamp: moment().valueOf(),
      })
    }

    const currBalance = result_1[0][0].SoDu

    console.log("số dư ==", currBalance)

    if (amount > currBalance) {
      return res.send({
        result_code: 1,
        result_message: 'Không đủ tiền để thanh toán',
        timestamp: moment().valueOf(),
      })
    }

    // call nạp tiền
    const connectorUrl = connector[bankNameB]

    // body
    const bodyData = {
      SoTKGui: accountNumberA,
      SoTKNhan: accountNumberB,
      SoTien: amount,
      NguoiTraPhi: payer,
      MoTa: note,
      key_message: `{\"LoaiGiaoDich\":\"NapTien\",\"SoTKGui\":\"${accountNumberA}\",\"SoTKNhan\":\"${accountNumberB}\",\"SoTien\":\"${amount}\",\"NguoiTraPhi\":\"${payer}\"}`
    }

    // sign data
    const key_signature = await signOpenPGP(bodyData.key_message)

    bodyData.key_signature = key_signature
    const timestamp = moment().valueOf()
    const joinData = ['api/v1/naptien', timestamp, JSON.stringify(bodyData), agentSecretKey].join("|")
    const signature = sha512(joinData)

    fetch(`${connectorUrl}/naptien`, {
      method: 'post',
      body: JSON.stringify(bodyData),
      headers: {
        'Content-Type': 'application/json',
        agent_code: bankNameB,
        api_signature: signature,
        ts: timestamp
      },
    })
      .then(res => res.json())
      .then(async json => {
        console.log("JSON => RESPONE ===>", json)
        //res.send(json)
        if (json.result_code === 0) {
          console.log("600")
          let sql_1 = "CALL proc_GiaoDichDoiNo_LienKet(?,?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
          let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [bodyData.SoTKGui, 'BBC', bodyData.SoTKNhan, bankNameB,
          bodyData.SoTien, 'Gui', bodyData.MoTa, bodyData.NguoiTraPhi, '', bodyData.key_signature])

          if (err_1) return res.status(422).send({
            success: false,
            message: err_1
          })

          const message = result_1[1][0] && result_1[1][0].message || ''
          const split = message.split(':')

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

          res.json({
            result_code: 0,
            message: 'Chuyển tiền thành công!'
          })
        }
      });
  }

  async getOTP(username) {
    console.log(username)
    let sql_1 = "CALL proc_viewOTP(?);";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username])

    console.log("GET OTP==", result_1[0])

    if (err_1) {
      console.log(err_1)
      return false
    }

    return result_1[0][0].ID_OTP
  }

}

module.exports = CoreController