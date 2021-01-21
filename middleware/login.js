const jwt = require('jsonwebtoken')

exports.required = (req, res, next) =>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'temporary')
        req.user = decode
        next()
    } catch (error) {
        return res.status(401).send({warning: 'authentication error'})
    }
}

exports.optional = (req, res, next) =>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'temporary')
        req.user = decode
        next()
    } catch (error) {
        next()
    }
}