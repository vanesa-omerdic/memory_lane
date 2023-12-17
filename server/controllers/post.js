const db = require('../db/connect')
const jwt = require('jsonwebtoken')
const config = require('config')

const getPosts = (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json({ success: false, msg: 'Not logged in!' })

    jwt.verify(token, config.get('privateKey'), (error, data) => {
        if(error) return res.status(403).json({ success: false, msg: 'Token is not valid!'})
    
        const query = 'SELECT m.*, firstname, lastname FROM memory AS m JOIN user AS u ON u.user_id = m.user_id ORDER BY m.creation_date DESC'

        db.query(query, (error, data) => {
            if(error) return res.status(500).json({ sucess: false, msg: 'Internal Server Error' })
            return res.status(200).json({ success: true, data })
        })
    })
}

const addPost = (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json({ success: false, msg: 'Not logged in!'})

    jwt.verify(token, config.get('privateKey'), (error, data) => {
        if(error) return res.status(403).json({ success: false, msg: 'Token is not valid!' })
        
        const query = 'INSERT INTO memory (event_description, is_public, user_id) VALUES (?)'
        
        const values = [req.body.description, req.body.isPublic , data.id]

        db.query(query, [values], (error, data) => {
            if(error) return res.status(500).json({ success: false, msg: error})
            
            const eventId = data.insertId
            console.log(eventId)
            const userId = data.user_id
            
            const imagesData = req.body.images.map(image => [
                image.url,
                eventId,
                //user_id: userId
            ])

            const placeholders = imagesData.map(() => '(?, ?)').join(', ')

            const insertImagesQuery = `INSERT INTO image (image_url, event_id) VALUES ${placeholders}`
        
            db.query(insertImagesQuery, imagesData.flat(), (error, data) => {
                if (error) return res.status(500).json({ success: false, msg: 'Error inserting image data.' })
                return res.status(200).json({ success: true, msg: 'Event and images successfully added.' })
            })
        })
    })
}


module.exports = {
getPosts,
addPost
}