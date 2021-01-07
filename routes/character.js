const express = require('express')
const router = express.Router()
const mysql = require('../mysql/mysql').pool

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT characters.id, characters.name, anime.name as `anime_name`, character_photos.name as `photo` FROM characters INNER JOIN anime ON characters.id_anime = anime.id INNER JOIN character_photos on characters.id = character_photos.id_character;',
        (error, result, fields) => {
            if(error) { return res.status(500).send({error: error}) }
            const response = {
                characters: result.map(char => {
                    return {
                        id: char.id,
                        name: char.name,
                        anime_name: char.anime_name,
                        photo: 'http://localhost:3000/images/'+char.photo
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
        conn.query('SELECT characters.id, characters.name, anime.name as `anime_name`, character_photos.name as `photo` FROM characters INNER JOIN anime ON characters.id_anime = anime.id INNER JOIN character_photos on characters.id = character_photos.id_character WHERE characters.id = ?;', [req.params.id],
        (error, result, fields) => {
            if(error) { return res.status(500).send({error: error}) }
            const response = {
                characters: result.map(char => {
                    return {
                        id: char.id,
                        name: char.name,
                        anime_name: char.anime_name,
                        photo: 'http://localhost:3000/images/'+char.photo
                    }
                })
            }
            return res.status(200).send(response)
        });

    })
})

router.post('/', (req, res, next)=> {
    res.status(201).send({
        msg: 'posted'
    })
})

module.exports = router