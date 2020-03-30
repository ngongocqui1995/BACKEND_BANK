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
router.use('/client', require(`${ROUTE_V1_PATH}/client.route`))
router.use('/employee', require(`${ROUTE_V1_PATH}/employee.route`))
router.use('/trans', require(`${ROUTE_V1_PATH}/transaction.route`))
router.use('/debt', require(`${ROUTE_V1_PATH}/debt.route`))

module.exports = router