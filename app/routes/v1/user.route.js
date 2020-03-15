const router = require('express').Router()
const UserController = require(`${global.APP_CONTROLLER_PATH}/user.controller`)
const user = new UserController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

//CRUD
router.get('/detail/:username/info', verifyAccessToken, user.info)

router.get('/', verifyAccessToken, user.getAll)

router.get('/danhsachnhanvien', verifyAccessToken, user.danhsachnhanvien)

router.get('/danhsachtt', verifyAccessToken, user.danhsachtt)

router.get('/danhsach/tk/:username', verifyAccessToken, user.danhsachtk)

router.post('/', verifyAccessToken, user.create)

router.put('/', verifyAccessToken, user.update)

router.post('/giaodich', verifyAccessToken, user.giaodich)

router.post('/giaodichdoino', verifyAccessToken, user.giaodichdoino)

router.get('/giaodich', verifyAccessToken, user.listgiaodich)

// other routes
module.exports = router