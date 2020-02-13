/**
 * Created by sang.nguyen on 06/12/2019
 */

const express = require('express')
const router = express.Router()

router.use('/v1', require(`${global.APP_ROUTE_PATH}/v1`))

module.exports = router