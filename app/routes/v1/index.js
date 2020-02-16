/**
 * Created by sang.nguyen on 06/12/2019
 *
 */
const express = require('express')
const router = express.Router()

const ROUTE_V1_PATH = `${global.APP_ROUTE_PATH}/v1`

router.use('/products', require(`${ROUTE_V1_PATH}/product.route`))
router.use('/auth', require(`${ROUTE_V1_PATH}/auth.route`))
router.use('/user', require(`${ROUTE_V1_PATH}/user.route`))

module.exports = router