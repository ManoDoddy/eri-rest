const { query } = require('express')
const mysql = require('../mysql/mysql')

exports.getCharacter = async (req, res, next) => {
    try {
        const query = `SELECT characters.id, characters.name, anime.id as 'anime_id', anime.name as 'anime_name'
                        FROM characters INNER JOIN anime ON characters.anime_id = anime.id;`
        const result = await mysql.execute(query)
        const response = {
            amount: result.length,
            characters: result.map(char => {
                return {
                    id: char.id,
                    name: char.name,
                    anime_id: char.anime_id,
                    anime_name: char.anime_name,
                    images: process.env.URL_API + 'character/' + char.id + '/images',
                    request: {
                        type: 'GET',
                        desc: 'returns individual character details',
                        url: process.env.URL_API + 'character/' + char.id
                    }
                }
            })
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.getIndividualCharacter = async (req, res, next) => {
    try {
        const query = `SELECT characters.id, characters.name, anime.id as 'anime_id', anime.name as 'anime_name'
                        FROM characters INNER JOIN anime ON characters.anime_id = anime.id WHERE characters.id = ?;`
        const result = await mysql.execute(query, [req.params.character_id])
        if (result.length == 0) {
            return res.status(404).send({
                message: 'id not found'
            })
        }
        const response = {
            character: {
                id: result[0].id,
                name: result[0].name,
                anime_id: result[0].anime_id,
                anime_name: result[0].anime_name,
                images: process.env.URL_API + 'character/' + result[0].id + '/images',
                request: {
                    type: 'GET',
                    desc: 'return all characters',
                    url: process.env.URL_API + 'character/'
                }
            }
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.searchCharacter = async (req, res, next) => {
    try {
        const query = `SELECT characters.id, characters.name, anime.id as 'anime_id', anime.name as 'anime_name'
                        FROM characters INNER JOIN anime ON characters.anime_id = anime.id WHERE characters.name LIKE ?;`
        const result = await mysql.execute(query, ['%' + req.params.name + '%'])
        if (result.length == 0) {
            return res.status(404).send({
                message: 'character not found'
            })
        }
        let response = {}
        if (result.length > 1) {
            response = {
                amount: result.length,
                characters: result.map(char => {
                    return {
                        id: char.id,
                        name: char.name,
                        anime_id: char.anime_id,
                        anime_name: char.anime_name,
                        images: process.env.URL_API + 'character/' + char.id + '/images',
                        request: {
                            type: 'GET',
                            desc: 'return all characters',
                            url: process.env.URL_API + 'character/'
                        }
                    }
                })
            }
        } else {
            response = {
                character: {
                    id: result[0].id,
                    name: result[0].name,
                    anime_id: result[0].anime_id,
                    anime_name: result[0].anime_name,
                    images: process.env.URL_API + 'character/' + result[0].id + '/images',
                    request: {
                        type: 'GET',
                        desc: 'return all characters',
                        url: process.env.URL_API + 'character/'
                    }
                }
            }
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.getCharacterImages = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM character_images WHERE character_id = ?;'
        const result = await mysql.execute(query, [req.params.character_id])
        if (result.length == 0) {
            return res.status(404).send({
                message: 'id not found'
            })
        }
        const response = {
            amount: result.length,
            character_id: req.params.character_id,
            images: result.map(image => {
                return {
                    id: image.id,
                    url: image.filename
                }
            })
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.insertCharacter = async (req, res, next) => {
    try {
        const query = 'INSERT INTO characters (name, anime_id) VALUES (? , ?)'
        const result = await mysql.execute(query, [req.body.name, req.body.anime_id])
        const queryImage = 'INSERT INTO character_images (character_id, filename) VALUES (? , ?)'
        const resultImage = await mysql.execute(queryImage, [result.insertId, req.file.data.link])
        const response = {
            message: 'character successfully inserted',
            character: {
                id: result.insertId,
                name: req.body.name,
                anime_id: req.body.anime_id,
                image_id: resultImage.insertId,
                filename: req.file.data.link,
                request: {
                    type: 'GET',
                    desc: 'return all characters',
                    url: process.env.URL_API + 'character/'
                }
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.insertCharacterImage = async (req, res, next) => {
    try {
        const query = 'INSERT INTO character_images (character_id, filename) VALUES (? , ?)'
        const result = await mysql.execute(query, [req.params.character_id, req.file.data.link])
        const response = {
            message: 'character image successfully inserted',
            image: {
                id: result.insertId,
                filename: req.file.data.link,
                character_id: req.params.character_id,
                request: {
                    type: 'GET',
                    desc: 'return all character images',
                    url: process.env.URL_API + 'character/' + req.params.character_id + '/images'
                }
            }
        }
        return res.status(201).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.updateCharacter = async (req, res, next) => {
    try {
        const query = 'UPDATE characters SET name = ?, anime_id = ? WHERE id = ?'
        const result = await mysql.execute(query, [req.body.name, req.body.anime_id, req.body.character_id])
        const response = {
            message: 'character successfully updated',
            character: {
                id: req.body.character_id,
                name: req.body.name,
                anime_id: req.body.anime_id,
                request: {
                    type: 'GET',
                    desc: 'returns individual character details',
                    url: process.env.URL_API + 'character/' + req.body.character_id
                }
            }
        }
        return res.status(202).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.deleteCharacter = async (req, res, next) => {
    try {
        const queryImage = 'DELETE FROM character_images WHERE character_id = ?'
        await mysql.execute(queryImage, [req.body.character_id])
        const query = 'DELETE FROM characters WHERE id = ?'
        await mysql.execute(query, [req.body.character_id])
        const response = {
            message: 'character successfully deleted',
            request: {
                type: 'POST',
                desc: 'insert a new character',
                url: process.env.URL_API + 'character/',
                body: {
                    name: 'STRING',
                    anime_id: 'INTEGER',
                    character_image: 'FILE/PNG||JPG||JPEG'
                }
            }
        }
        return res.status(202).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.deleteImage = async (req, res, next) => {
    try {
        const query = 'DELETE FROM character_images WHERE id = ? AND character_id = ?'
        await mysql.execute(query, [req.body.image_id, req.params.character_id])
        const response = {
            message: 'character image successfully deleted',
            request: {
                type: 'POST',
                desc: 'insert a new character image',
                url: process.env.URL_API + 'character/' + req.params.character_id + '/images',
                body: {
                    character_image: 'FILE/PNG||JPG||JPEG'
                }
            }
        }
        return res.status(202).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}