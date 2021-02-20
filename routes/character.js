const express = require('express')
const router = express.Router()
const ImgurStorage = require('multer-storage-imgur');
const multer = require('multer')
const login = require('../middleware/login')

const upload = multer({
    storage: ImgurStorage({ clientId: process.env.IMGUR_CLIENTID })
  })

const CharacterController = require('../controllers/character-controller')

router.get('/', CharacterController.getCharacter)
router.get('/:character_id', CharacterController.getIndividualCharacter)
router.get('/search/:name', CharacterController.searchCharacter)
router.get('/:character_id/images', CharacterController.getCharacterImages)
router.post('/:character_id/images', login.required, upload.single('character_image'), CharacterController.insertCharacterImage)
router.post('/', login.required, upload.single('character_image'), CharacterController.insertCharacter)
router.patch('/', login.required, upload.none(), CharacterController.updateCharacter)
router.delete('/', login.required, upload.none(), CharacterController.deleteCharacter)
router.delete('/:character_id/images', login.required, upload.none(), CharacterController.deleteImage)

module.exports = router