const router = require('express').Router()
const UserController = require(`${global.APP_CONTROLLER_PATH}/user.controller`)
const user = new UserController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

//CRUD
router.get('/', verifyAccessToken, user.getAll)

router.put('/', verifyAccessToken, user.update)

router.get('/:username', verifyAccessToken, user.info)

router.get('/:type/:username', verifyAccessToken, user.getAccountByType)

// other routes
module.exports = router