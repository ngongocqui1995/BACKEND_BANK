const router = require('express').Router()
const AuthController = require(`${global.APP_CONTROLLER_PATH}/auth.controller`)
const auth = new AuthController()

//CRUD
router.post('/login', auth.login)

router.post('/gettoken', auth.getToken)

// other routes
module.exports = router
