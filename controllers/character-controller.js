const mysql = require('../mysql/mysql').pool

exports.getCharacter = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT characters.id, characters.name, anime.id as `anime_id`, anime.name as `anime_name` FROM characters INNER JOIN anime ON characters.anime_id = anime.id;',
        (error, result, fields) => {
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            const response = {
                amount: result.length,
                characters: result.map(char => {
                    return {
                        id: char.id,
                        name: char.name,
                        anime_id: char.anime_id,
                        anime_name: char.anime_name,
                        images: 'http://localhost:3000/character/'+char.id+'/images',
                        request: {
                            type: 'GET',
                            desc: 'returns individual character details',
                            url: 'http://localhost:3000/character/'+char.id
                        }
                    }
                })
            }
            return res.status(200).send(response)
        });
    })
}

exports.getIndividualCharacter = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT characters.id, characters.name, anime.id as `anime_id`, anime.name as `anime_name` FROM characters INNER JOIN anime ON characters.anime_id = anime.id WHERE characters.id = ?;', [req.params.id],
        (error, result, fields) => {
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            if(result.length == 0){
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
                        images: 'http://localhost:3000/character/'+result[0].id+'/images',
                        request: {
                            type: 'GET',
                            desc: 'return all characters',
                            url: 'http://localhost:3000/character/'
                        }
                }
            }
            return res.status(200).send(response)
        });
    })
}

exports.searchCharacter = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT characters.id, characters.name, anime.id as `anime_id`, anime.name as `anime_name` FROM characters INNER JOIN anime ON characters.anime_id = anime.id WHERE characters.name LIKE ?;', ['%'+req.params.name+'%'],
        (error, result, fields) => {
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            if(result.length == 0){
                return res.status(404).send({
                    message: 'character not found'
                })
            }
            let response = {}
            if(result.length>1){
                response = {
                    amount: result.length,
                    characters: result.map(char =>{
                        return {
                            id: char.id,
                            name: char.name,
                            anime_id: char.anime_id,
                            anime_name: char.anime_name,
                            images: 'http://localhost:3000/character/'+char.id+'/images',
                            request: {
                                type: 'GET',
                                desc: 'return all characters',
                                url: 'http://localhost:3000/character/'
                            }
                        }
                    })
                }
            }else{
                response = {
                    character: {
                            id: result[0].id,
                            name: result[0].name,
                            anime_id: result[0].anime_id,
                            anime_name: result[0].anime_name,
                            images: 'http://localhost:3000/character/'+result[0].id+'/images',
                            request: {
                                type: 'GET',
                                desc: 'return all characters',
                                url: 'http://localhost:3000/character/'
                            }
                    }
                }
            }
            return res.status(200).send(response)
        });
    })
}

exports.getCharacterImages = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('SELECT * FROM character_images WHERE character_id = ?;', [req.params.id],
        (error, result, fields) => {
            conn.release()
            if(error) { return res.status(500).send({error: error}) }
            if(result.length == 0){
                return res.status(404).send({
                    message: 'id not found'
                })
            }
            const response = {
                amount: result.length,
                character_id: req.params.id,
                images: result.map(image => {
                    return {
                        id: image.id,
                        url: 'http://localhost:3000/images/'+image.filename
                    }
                })
            }
            return res.status(200).send(response)
        });
    })
}

exports.insertCharacter = (req, res, next)=> {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('INSERT INTO characters (name, anime_id) VALUES (? , ?)',[req.body.name, req.body.anime_id],
            (error, result, fields) =>{
                if(error) { return res.status(500).send({error: error}) }
                conn.query('INSERT INTO character_images (character_id, filename) VALUES (? , ?)',[result.insertId, req.file.filename],
                    (error, result, fields) => {
                        conn.release()
                        if(error) { return res.status(500).send({error: error}) }
                        const response = {
                            message: 'character successfully inserted',
                            character: {
                                id: result.insertId,
                                name: req.body.name,
                                anime_id: req.body.anime_id,
                                request: {
                                    type: 'GET',
                                    desc: 'return all characters',
                                    url: 'http://localhost:3000/character/'
                                }
                            }
                        }
                        return res.status(201).send(response)
                })
        })
    })
}

exports.insertCharacterImage = (req, res, next)=> {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('INSERT INTO character_images (character_id, filename) VALUES (? , ?)',[req.params.id, req.file.filename],
            (error, result, fields) =>{
                conn.release()
                if(error) { return res.status(500).send({error: error}) }
                const response = {
                    message: 'character image successfully inserted',
                    image: {
                        id: result.insertId,
                        filename: req.file.filename,
                        character_id: req.params.id,
                        request: {
                            type: 'GET',
                            desc: 'return all character images',
                            url: 'http://localhost:3000/character/'+req.params.id+'/images'
                        }
                    }
                }
                return res.status(201).send(response)
        })
    })
}

exports.updateCharacter = (req, res, next)=> {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('UPDATE characters SET name = ?, anime_id = ? WHERE id = ?',[req.body.name,req.body.anime_id,req.body.id],
            (error,result,fields) =>{
                conn.release()
                if(error) { return res.status(500).send({error: error}) }
                const response = {
                    message: 'character successfully updated',
                    character: {
                        id: req.body.id,
                        name: req.body.name,
                        anime_id: req.body.anime_id,
                        request: {
                            type: 'GET',
                            desc: 'returns individual character details',
                            url: 'http://localhost:3000/character/' + req.body.id
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
}

exports.deleteCharacter = (req, res, next)=> {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({error: error}) }
        conn.query('DELETE FROM character_images WHERE character_id = ?',[req.body.id],
            (error,result,fields) =>{
                if(error) { return res.status(500).send({error: error}) }
                conn.query('DELETE FROM characters WHERE id = ?',[req.body.id],
                    (error,result,fields) =>{
                        conn.release()
                        if(error) { return res.status(500).send({error: error}) }
                        const response = {
                            message: 'character successfully deleted',
                            request: {
                                type: 'POST',
                                desc: 'insert a new character',
                                url: 'http://localhost:3000/character/',
                                body: {
                                    name: 'STRING',
                                    anime_id: 'INTEGER',
                                    character_image: 'FILE/PNG||JPG||JPEG'
                                }
                            }
                        }
                        return res.status(202).send(response)
                })
            }
        )
    })
}

exports.deleteImage = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query('DELETE FROM character_images WHERE id = ?',[req.body.id], (error, result, fields)=>{
            conn.release();
            if(error) { return res.status(500).send({error: error}) }
            const response = {
                message: 'character image successfully deleted',
                request: {
                    type: 'POST',
                    desc: 'insert a new character image',
                    url: 'http://localhost:3000/character/'+req.params.id+'/images',
                    body: {
                        character_image: 'FILE/PNG||JPG||JPEG'
                    }
                }
            }
            return res.status(202).send(response)
        })
    })
}