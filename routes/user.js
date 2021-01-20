const express = require('express')
const router = express.Router()
const mysql = require('../mysql/mysql').pool
const  bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        bcrypt.hash(req.body.password, 5, (errBcrypt, hash) =>{
            if(errBcrypt) { return res.status(500).send({error: errBcrypt})}
            conn.query('INSERT INTO user (username, password) VALUES (? , ?)', [req.body.username, hash],
            (error, result, fields) =>{
                conn.release()
                if(error) { return res.status(500).send({error: error}) }
                const response = {
                    message: 'user created successfully',
                    user: {
                        id: result.insertId,
                        username: req.body.username
                    }
                }
                return res.status(201).send(response)
            })
        })
    })
})

router.post('/login', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        const query = 'SELECT * FROM user WHERE username = ?'
        conn.query(query, [req.body.username], (error, results, fields) =>{
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            if(results.length < 1){
                return res.status(401).send({warning: 'authentication error'})
            }
            bcrypt.compare(req.body.password, results[0].password, (error, result) =>{
                if (error) {
                    return res.status(401).send({warning: 'authentication error'})
                }
                if (result) {
                    const token = jwt.sign({
                        id: results[0].id,
                        username: results[0].username
                    },
                    'temporary',
                    {
                        expiresIn: "1h"
                    })
                    return res.status(202).send({warning: 'authentication success', token: token})
                }
                return res.status(401).send({warning: 'authentication error'})
            })
        })
    })
})

module.exports = router