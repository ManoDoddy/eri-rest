const express = require('express')
const app = express()
const morgan = require('morgan')

const charactersRoute = require('./routes/character')

app.use(morgan('dev'))
app.use('/character', charactersRoute)

app.use((req, res, next) => {
    const err = new Error('not found')
    err.status = 404
    next(err)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        err: {
            msg: error.message
        }
    })
})

module.exports = app