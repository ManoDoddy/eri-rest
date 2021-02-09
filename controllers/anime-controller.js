const mysql = require('../mysql/mysql')

exports.getAnime = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM anime;'
        const result = await mysql.execute(query)
        const response = {
            amount: result.length,
            animes: result.map(anime => {
                return {
                    id: anime.id,
                    name: anime.name,
                    request: {
                        type: 'GET',
                        desc: 'returns individual anime details',
                        url: process.env.URL_API + 'anime/' + anime.id
                    }
                }
            })
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.getIndividualAnime = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM anime WHERE id = ?;'
        const result = await mysql.execute(query, [req.params.anime_id])
        if (result.length == 0) {
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
                    url: process.env.URL_API + 'anime/'
                }
            }
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.getAnimeCharacters = async (req, res, next) => {
    try {
        const query = `SELECT anime.id AS 'anime_id', anime.name AS 'anime_name', characters.name AS 'character_name', characters.id AS 'character_id'
                        FROM anime INNER JOIN characters ON anime.id = characters.anime_id WHERE anime.id = ?`
        const result = await mysql.execute(query, [req.params.anime_id])
        if (result.length == 0) {
            return res.status(404).send({
                message: 'id not found or no registered characters'
            })
        }
        const response = {
            amount: result.length,
            anime_id: req.params.anime_id,
            characters: result.map(char => {
                return {
                    id: char.character_id,
                    name: char.character_name,
                    anime_name: char.anime_name,
                    request: {
                        type: 'GET',
                        desc: 'returns individual character details',
                        url: process.env.URL_API + 'character/' + char.character_id
                    }
                }
            })
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.insertAnime = async (req, res, next) => {
    try {
        const query = 'INSERT INTO anime (name) VALUES (?)'
        const result = await mysql.execute(query, [req.body.name])
        const response = {
            message: 'anime successfully inserted',
            anime: {
                id: result.insertId,
                name: req.body.name,
                request: {
                    type: 'GET',
                    desc: 'return all animes',
                    url: process.env.URL_API + 'anime/'
                }
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.updateAnime = async (req, res, next) => {
    try {
        const query = 'UPDATE anime SET name = ? WHERE id = ?'
        const result = await mysql.execute(query, [req.body.name, req.body.anime_id])
        const response = {
            message: 'anime successfully updated',
            anime: {
                id: req.body.anime_id,
                name: req.body.name,
                request: {
                    type: 'GET',
                    desc: 'returns individual anime details',
                    url: process.env.URL_API + 'anime/' + req.body.anime_id
                }
            }
        }
        return res.status(202).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.deleteAnime = async (req, res, next) => {
    try {
        const query = 'DELETE FROM anime WHERE id = ?'
        const result = await mysql.execute(query, [req.body.anime_id])
        const response = {
            message: 'anime successfully deleted',
            request: {
                type: 'POST',
                desc: 'insert a new anime',
                url: process.env.URL_API + 'anime/',
                body: {
                    name: 'STRING'
                }
            }
        }
        return res.status(202).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}