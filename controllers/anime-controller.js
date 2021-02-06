const mysql = require('../mysql/mysql').pool

exports.getAnime = (req, res, next) => {
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
}

exports.getIndividualAnime = (req, res, next) => {
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
}

exports.getAnimeCharacters = (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT anime.id AS `anime_id`, anime.name AS `anime_name`, characters.name AS `character_name`, characters.id AS `character_id` FROM anime INNER JOIN characters ON anime.id = characters.anime_id WHERE anime.id = ?',
        [req.params.id], (error, result, fields) =>{
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            if(result.length == 0){
                return res.status(404).send({
                    message: 'id not found'
                })
            }
            const response = {
                amount: result.length,
                anime_id: req.params.id,
                characters: result.map(char => {
                    return {
                        id: char.character_id,
                        name: char.character_name,
                        anime_name: char.anime_name,
                        request: {
                            type: 'GET',
                            desc: 'returns individual character details',
                            url: 'http://localhost:3000/character/'+char.character_id
                        }
                    }
                })
            }
            return res.status(200).send(response)
        })
    })
}

exports.insertAnime = (req, res, next)=> {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('INSERT INTO anime (name) VALUES (?)',[req.body.name],
            (error,result,fields) =>{
                conn.release()
                if(error) { return res.status(500).send({error: error}) }
                const response = {
                    message: 'anime successfully inserted',
                    anime: {
                        id: result.insertId,
                        name: req.body.name,
                        request: {
                            type: 'GET',
                            desc: 'return all animes',
                            url: 'http://localhost:3000/anime/'
                        }
                    }
                }
                return res.status(201).send(response)
        })
    })
}

exports.updateAnime = (req, res, next)=> {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('UPDATE anime SET name = ? WHERE id = ?',[req.body.name,req.body.id],
            (error,result,fields) =>{
                conn.release()
                if(error) { return res.status(500).send({error: error}) }
                const response = {
                    message: 'anime successfully updated',
                    anime: {
                        id: req.body.id,
                        name: req.body.name,
                        request: {
                            type: 'GET',
                            desc: 'returns individual anime details',
                            url: 'http://localhost:3000/anime/' + req.body.id
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
}

exports.deleteAnime = (req, res, next)=> {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('DELETE FROM anime WHERE id = ?',[req.body.id],
            (error,result,fields) =>{
                conn.release()
                if(error) { return res.status(500).send({error: error}) }
                const response = {
                    message: 'anime successfully deleted',
                    request: {
                        type: 'POST',
                        desc: 'insert a new anime',
                        url: 'http://localhost:3000/anime/',
                        body: {
                            name: 'STRING'
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
}