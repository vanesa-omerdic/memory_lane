const db = require('../db/connect.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')


const login = (req, res) => {
    const query = 'SELECT * FROM user WHERE email = ?'

    db.query(query, [req.body.email], (error, data) => {
        if(error) return res.status(500).json({ success: false, msg: 'Internal Server Error' })

        if(data.length === 0) return res.status(404).json({ success: false, msg: 'User not found!'})
        
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].user_password)

        if(!checkPassword) return res.status(400).json({ success: false, msg: 'Wrong password or email!' })

        const token = jwt.sign({ id: data[0].user_id}, config.get('privateKey'))
        const {user_password, ...otherData} = data[0]
        //res.status(200).json({ success: true, data: otherData })
        res.cookie('accessToken', token, {
            httpOnly: true,
        }).status(200).json({ success: true, data: otherData})
        //res.status(200).json({ success: true, data: otherData, token})
        //res.header('x-accessToken', token).json({ success: true, data: otherData})
    })
}

const register = (req, res) => {
    const query = 'SELECT * FROM user WHERE email = ?'

    db.query(query, [req.body.email], (error, data) => {

        if(error) return res.status(500).json({ success: false, msg: 'Internal Server Error' })
        if(data.length) return res.status(409).json({ success: false, msg: 'User already exists' })
        
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        const query = 'INSERT INTO user (firstname, lastname, email, user_password) VALUES (?)'
        const values = [req.body.firstname, req.body.lastname, req.body.email, hashedPassword]
        
        db.query(query, [values], (error, data) => {
            if(error) return res.status(500).json({ success: false, msg: 'Internal Server Error' })
            
            res.status(200).json({ success: true, msg: 'User has been created' })
        })
    })
}

const logout = (req, res) => {
    res.clearCookie('accessToken', {
        secure: true,
        sameSite: 'none'
    }).status(200).json({ success: true, msg: 'User has been logged out.'})

}

module.exports = {
    login,
    register,
    logout
}

