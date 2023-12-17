const express = require('express')
const router = express.Router()
const connection = require('../db/connect')

/*
router.get('/', (req, res) => {
    const { email, password } = req.body
    console.log(req.params)
    console.log(req.body)
    if(email && password) {
        return res.status(200).send(`Welcome ${email}`)
    } 
    res.status(401).send('Create account')

})
*/

router.get('/', (req, res) => {
    const {email, password} = req.body
    console.log(email, password)
    if(!email || !password) {
        return res.status(401).json({ success: false, msg: 'poruka'})
    }
    const query = `SELECT * FROM user WHERE email = '${email}' AND user_password = '${password}'`
    connection.query(query, (error, result) => {
        if(error) {
            res.status(500).json({ success: false, msg: 'neka poruka'})
        }
        else {
            console.log(result)
            if(result.length == 0) {
                return res.status(401).json({ success: false, msg: 'unesite podatke'})
            }
            res.status(200).json({ success: true, data: result})   
        }
    })
})

module.exports = router