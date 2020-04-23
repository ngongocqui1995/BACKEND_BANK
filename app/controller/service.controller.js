const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')
const moment = require('moment')

class ServiceController extends BaseController {
    constructor() {
        super(mongoose)
    }

    async getInfo(req, res) {
        const data = req.body
        console.log(data)
        // lấy thông tin user
        let sql_1 = "CALL proc_viewTTTKRaUser(?, @kq); select @kq as `message`;";
        let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [data.account_number])

        if (err_1) return res.status(422).send({
            success: false,
            message: err_1
        })

        const result = result_1[0].fieldCount
        if (result === 0) {
            const message = result_1[1][0].message
            console.log(message)
            const split = message.split(':')
            return res.status(422).send({
                success: false,
                ref_time: moment().valueOf(),
                result_code: +split[0],
                message: split[1]
            })
        }

        console.log(result_1[0].fieldCount)

        res.send({
            data: result_1[0][0],
            success: true,
            ref_time: moment().valueOf(),
            result_code: 0,
            message: "Lấy thông tin thành công!"
        })
    }

    async topup(req, res) {
        let { account_number, request_amount } = req.body.rsa_message

        // account number 1
        // chuyển tiền nội bộ
        let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
        let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ["1", 'BBC', account_number, 'BBC', request_amount, 'Gui', '', 'B', ''])

        console.log(result_1)

        if (err_1) return res.status(422).send({
            success: false,
            message: err_1
        })


        console.log("-Nạp tiền thành công!!!")

        res.send({
            transactionAmount: request_amount,
            ref_time: moment().format("YYYYMMDDHHmmss").valueOf(),
            success: true,
            message: "Nạp tiền thành công!"
        })
    }

    async cashout(req, res) {
        let { account_number_A, account_number_B, bank_name, request_amount } = req.body.rsa_message

        // account number 1
        // chuyển tiền nội bộ
        let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
        let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [account_number_A, 'BBC', account_number_B, bank_name, request_amount, 'Gui', '', 'B', ''])

        console.log(result_1)

        if (err_1) return res.status(422).send({
            success: false,
            message: err_1
        })

        console.log("-Nạp tiền thành công!!!")

        res.send({
            transactionAmount: request_amount,
            ref_time: moment().format("YYYYMMDDHHmmss").valueOf(),
            success: true,
            message: "Trừ tiền thành công!"
        })
    }
}

module.exports = ServiceController