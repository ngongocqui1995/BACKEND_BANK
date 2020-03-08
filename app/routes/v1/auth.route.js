const router = require('express').Router()
const AuthController = require(`${global.APP_CONTROLLER_PATH}/auth.controller`)
const auth = new AuthController()
const {verifyAccessToken, verifyRefreshToken} = require('../../middleware/auth.mware')

//CRUD
router.post('/login', auth.login)

router.get('/getNewToken', verifyRefreshToken, auth.getNewToken)

// other routes
module.exports = router
