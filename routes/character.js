const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).send({
        msg: 'ok'
    })
})

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    res.status(200).send({
        msg: 'ok',
        id: id
    })
})

router.post('/', (req, res, next)=> {
    res.status(201).send({
        msg: 'posted'
    })
})

module.exports = router