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
router.use('/reciever', require(`${ROUTE_V1_PATH}/reciever.route`))
router.use('/bank', require(`${ROUTE_V1_PATH}/bank.route`))
router.use('/bbc', require(`${ROUTE_V1_PATH}/service.route`))
router.use('/naptien', require(`${ROUTE_V1_PATH}/topup.route`))
router.use('/trutien', require(`${ROUTE_V1_PATH}/withdrawal.route`))

module.exports = router