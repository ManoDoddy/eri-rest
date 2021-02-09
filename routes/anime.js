const express = require('express')
const router = express.Router()
const login = require('../middleware/login')
const multer = require('multer')

const upload = multer()

const AnimeController = require('../controllers/anime-controller')

router.get('/', AnimeController.getAnime)
router.get('/:anime_id', AnimeController.getIndividualAnime)
router.get('/:anime_id/characters', AnimeController.getAnimeCharacters)
router.post('/', login.required, upload.none(), AnimeController.insertAnime)
router.patch('/', login.required, upload.none(), AnimeController.updateAnime)
router.delete('/', login.required, upload.none(), AnimeController.deleteAnime)

module.exports = router