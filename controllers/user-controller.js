const mysql = require('../mysql/mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.userRegister = async (req, res, next) => {
    try {
        let query = 'SELECT * FROM user WHERE username = ?'
        let result = await mysql.execute(query, [req.body.username])
        if (result.length > 0) {
            return res.status(409).send({ message: 'user already registered' })
        }
        const hash = await bcrypt.hashSync(req.body.password, 5)
        query = 'INSERT INTO user (username, password) VALUES (? , ?)'
        result = await mysql.execute(query, [req.body.username, hash])
        const response = {
            message: 'user created successfully',
            user: {
                id: result.insertId,
                username: req.body.username
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.userLogin = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM user WHERE username = ?'
        const result = await mysql.execute(query, [req.body.username])
        if (result.length < 1) {
            return res.status(401).send({ message: 'authentication error' })
        }
        if (await bcrypt.compareSync(req.body.password, result[0].password)) {
            const token = jwt.sign({
                id: result[0].id,
                username: result[0].username
            },
                process.env.JWT_KEY,
                {
                    expiresIn: "2h"
                })
            return res.status(202).send({ message: 'authentication success', token: token })
        }
        return res.status(401).send({ message: 'authentication error' })
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}