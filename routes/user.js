const express = require('express')
const router = express.Router()
const multer = require('multer')

const upload = multer()

const UserController = require('../controllers/user-controller')

router.post('/register', upload.none(), UserController.userRegister)
router.post('/login', upload.none(), UserController.userLogin)

module.exports = router