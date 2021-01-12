const express = require('express')
const router = express.Router()
const mysql = require('../mysql/mysql').pool

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
        conn.query('SELECT characters.id, characters.name, anime.id as `anime_id`, anime.name as `anime_name` FROM characters INNER JOIN anime ON characters.id_anime = anime.id WHERE characters.name = ?;', [req.params.id],
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

router.post('/', (req, res, next)=> {
    res.status(201).send({
        message: 'coming soon'
    })
})

module.exports = router