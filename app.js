const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const charactersRoute = require('./routes/character')
const animesRoute = require('./routes/anime')
const userRoute = require('./routes/user')

app.use(morgan('dev'))
app.use('/images', express.static('images'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, OPTIONS')
        return res.status(200).send({})
    }
    next()
})

app.use('/character', charactersRoute)
app.use('/anime', animesRoute)
app.use('/user', userRoute)

app.use((req, res, next) => {
    const err = new Error('not found')
    err.status = 404
    next(err)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        err: {
            message: error.message
        }
    })
})

module.exports = app