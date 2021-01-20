const express = require('express')
const router = express.Router()
const mysql = require('../mysql/mysql').pool
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

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT characters.id, characters.name, anime.id as `anime_id`, anime.name as `anime_name` FROM characters INNER JOIN anime ON characters.id_anime = anime.id;',
        (error, result, fields) => {
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            const response = {
                amount: result.length,
                characters: result.map(char => {
                    return {
                        id: char.id,
                        name: char.name,
                        anime_id: char.anime_id,
                        anime_name: char.anime_name,
                        photos: 'http://localhost:3000/character/'+char.id+'/images',
                        request: {
                            type: 'GET',
                            desc: 'returns individual character details',
                            url: 'http://localhost:3000/character/'+char.id
                        }
                    }
                })
            }
            return res.status(200).send(response)
        });
    })
})

router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT characters.id, characters.name, anime.id as `anime_id`, anime.name as `anime_name` FROM characters INNER JOIN anime ON characters.id_anime = anime.id WHERE characters.id = ?;', [req.params.id],
        (error, result, fields) => {
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            if(result.length == 0){
                return res.status(404).send({
                    message: 'id not found'
                })
            }
            const response = {
                character: {
                        id: result[0].id,
                        name: result[0].name,
                        anime_id: result[0].anime_id,
                        anime_name: result[0].anime_name,
                        photos: 'http://localhost:3000/character/'+result[0].id+'/images',
                        request: {
                            type: 'GET',
                            desc: 'return all characters',
                            url: 'http://localhost:3000/character/'
                        }
                }
            }
            return res.status(200).send(response)
        });
    })
})

router.get('/search/:name', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT characters.id, characters.name, anime.id as `anime_id`, anime.name as `anime_name` FROM characters INNER JOIN anime ON characters.id_anime = anime.id WHERE characters.name = ?;', [req.params.name],
        (error, result, fields) => {
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            if(result.length == 0){
                return res.status(404).send({
                    message: 'character not found'
                })
            }
            const response = {
                character: {
                        id: result[0].id,
                        name: result[0].name,
                        anime_id: result[0].anime_id,
                        anime_name: result[0].anime_name,
                        photos: 'http://localhost:3000/character/'+result[0].id+'/images',
                        request: {
                            type: 'GET',
                            desc: 'return all characters',
                            url: 'http://localhost:3000/character/'
                        }
                }
            }
            return res.status(200).send(response)
        });
    })
})

router.get('/:id/images', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT * FROM character_photos WHERE id_character = ?;', [req.params.id],
        (error, result, fields) => {
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            if(result.length == 0){
                return res.status(404).send({
                    message: 'id not found'
                })
            }
            const response = {
                amount: result.length,
                character: result.map(image => {
                    return {
                        id: image.id,
                        id_character: image.id_character,
                        photo: 'http://localhost:3000/images/'+image.name,                        
                        request: {
                            type: 'GET',
                            desc: '',
                            url: ''
                        }
                    }
                })
            }
            return res.status(200).send(response)
        });
    })
})

router.post('/', login.required ,upload.single('character_image') ,(req, res, next)=> {
    console.log(req.file)
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('INSERT INTO characters (name, id_anime) VALUES (? , ?)',[req.body.name, req.body.id_anime],
            (error, result, fields) =>{
                conn.release()
                if(error) { return res.status(500).send({error: error}) }
                const response = {
                    message: 'character successfully inserted',
                    character: {
                        id: result.insertId,
                        name: req.body.name,
                        anime_id: req.body.id_anime,
                        request: {
                            type: 'GET',
                            desc: 'return all characters',
                            url: 'http://localhost:3000/character/'
                        }
                    }
                }
                return res.status(201).send(response)
        })
    })
})

router.patch('/', login.required ,(req, res, next)=> {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('UPDATE characters SET name = ?, id_anime = ? WHERE id = ?',[req.body.name,req.body.id_anime,req.body.id],
            (error,result,fields) =>{
                conn.release()
                if(error) { return res.status(500).send({error: error}) }
                const response = {
                    message: 'character successfully updated',
                    character: {
                        id: req.body.id,
                        name: req.body.name,
                        id_anime: req.body.id_anime,
                        request: {
                            type: 'GET',
                            desc: 'returns individual character details',
                            url: 'http://localhost:3000/character/' + req.body.id
                        }
                    }
                }
                res.status(202).send(response)
            }
        )
    })
})

router.delete('/', login.required ,(req, res, next)=> {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('DELETE FROM characters WHERE id = ?',[req.body.id],
            (error,result,fields) =>{
                conn.release()
                if(error) { return res.status(500).send({error: error}) }
                const response = {
                    message: 'character successfully deleted',
                    request: {
                        type: 'POST',
                        desc: 'insert a new character',
                        url: 'http://localhost:3000/character/',
                        body: {
                            name: 'STRING',
                            id_anime: 'INTEGER'
                        }
                    }
                }
                res.status(202).send(response)
            }
        )
    })
})

module.exports = router