const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')
const moment = require('moment')
const fetch = require('node-fetch');
const connector = require('../../config/connector')

class CoreController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async getInfo(req, res) {
    const data = req.body
    const {agent_code, api_signature, ts} = req.headers
    const connectorUrl = connector[agent_code]
    fetch(`${connectorUrl}/truyvanthongtin`, {
        method: 'post',
        body:    JSON.stringify(data),
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
}

module.exports = CoreController