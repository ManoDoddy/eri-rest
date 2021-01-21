const express = require('express')
const router = express.Router()
const login = require('../middleware/login')
const multer = require('multer')

const upload = multer()

const AnimeController = require('../controllers/anime-controller')

router.get('/', AnimeController.getAnime)
router.get('/:id', AnimeController.getIndividualAnime)
router.post('/', login.required, upload.none(), AnimeController.insertAnime)
router.patch('/', login.required, upload.none(), AnimeController.updateAnime)
router.delete('/', login.required, upload.none(), AnimeController.deleteAnime)

module.exports = router