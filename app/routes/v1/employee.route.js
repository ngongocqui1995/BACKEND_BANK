const router = require('express').Router()
const EmployeeController = require(`${global.APP_CONTROLLER_PATH}/employee.controller`)

const employee = new EmployeeController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

router.get('/', verifyAccessToken, employee.getAll)

router.post('/topup', verifyAccessToken, employee.topup)

router.put('/lock/:id', verifyAccessToken, employee.lock)

router.post('/unlock/:id', verifyAccessToken, employee.unlock)
// other routes
module.exports = router