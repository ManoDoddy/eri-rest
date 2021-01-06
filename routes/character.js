const express = require('express')
const router = express.Router()
const mysql = require('../mysql/mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT * FROM characters;', (error, result, fields) => {
            if(error) { return res.status(500).send({error: error}) }
            return res.status(200).send(result)
        });

    })
})

router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT * FROM characters WHERE id = ?;', [req.params.id],
        (error, result, fields) => {
            if(error) { return res.status(500).send({error: error}) }
            return res.status(200).send(result)
        });

    })
})

router.post('/', (req, res, next)=> {
    res.status(201).send({
        msg: 'posted'
    })
})

module.exports = router