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
            data: result_1[0][0],
            success: true,
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