const express = require('express')
const router = express.Router()
const mysql = require('../mysql/mysql').pool

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT * FROM anime;',
        (error, result, fields) => {
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            const response = {
                amount: result.length,
                animes: result.map(anime => {
                    return {
                        id: anime.id,
                        name: anime.name,
                        request: {
                            type: 'GET',
                            desc: 'returns individual anime details',
                            url: 'http://localhost:3000/anime/'+anime.id
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
        conn.query('SELECT * FROM anime WHERE id = ?;', [req.params.id],
        (error, result, fields) => {
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            if(result.length == 0){
                return res.status(404).send({
                    message: 'id not found'
                })
            }
            const response = {
                anime: {
                        id: result[0].id,
                        name: result[0].name,
                        request: {
                            type: 'GET',
                            desc: 'return all animes',
                            url: 'http://localhost:3000/anime/'
                        }
                }
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