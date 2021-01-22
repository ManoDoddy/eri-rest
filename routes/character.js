const express = require('express')
const router = express.Router()
const multer = require('multer')
const login = require('../middleware/login')

const storage = multer.diskStorage({
    destination: function(request, file, cb) {
        cb(null, './images/')
    },
    filename: function(request, file, cb) {
        cb(null, new Date().toISOString().replace(/[:.-]/g, '')+'.'+file.originalname.split('.').pop())
    },
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
    fileFilter: fileFilter
})

const CharacterController = require('../controllers/character-controller')

router.get('/', CharacterController.getCharacter)
router.get('/:id', CharacterController.getIndividualCharacter)
router.get('/search/:name', CharacterController.searchCharacter)
router.get('/:id/images', CharacterController.getCharacterImages)
router.post('/:id/images', upload.single('character_image'), CharacterController.insertCharacterImage)
router.post('/', login.required, upload.single('character_image'), CharacterController.insertCharacter)
router.patch('/', login.required, upload.none(), CharacterController.updateCharacter)
router.delete('/', login.required, upload.none(), CharacterController.deleteCharacter)
router.delete('/:id/images', upload.none(), CharacterController.deleteImage)

module.exports = router