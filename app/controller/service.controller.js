const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')

class ServiceController extends BaseController {
    constructor() {
        super(mongoose)
    }

    async getInfo(req, res) {
    }
}

module.exports = ServiceController