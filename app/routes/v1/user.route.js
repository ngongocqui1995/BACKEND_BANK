const router = require('express').Router()
const UserController = require(`${global.APP_CONTROLLER_PATH}/user.controller`)
const user = new UserController()

//CRUD
router.get('/info', user.info)

// other routes
module.exports = router