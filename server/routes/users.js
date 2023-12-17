const express = require('express')
const router = express.Router()
const getUser = require('../controllers/user.js')

router.get('/find/:userId', getUser)