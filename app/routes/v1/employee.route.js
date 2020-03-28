const router = require('express').Router()
const EmployeeController = require(`${global.APP_CONTROLLER_PATH}/employee.controller`)

const employee = new EmployeeController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

router.get('/', verifyAccessToken, employee.getAll)

// other routes
module.exports = router