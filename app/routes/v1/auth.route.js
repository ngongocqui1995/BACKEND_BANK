const router = require('express').Router()
const AuthController = require(`${global.APP_CONTROLLER_PATH}/auth.controller`)
const auth = new AuthController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

//CRUD
router.post('/login', auth.login)

router.get('/gettoken', verifyAccessToken, auth.getToken)

// other routes
module.exports = router
