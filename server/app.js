const express = require('express')
const app = express()
const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/users.js')
const postRoutes = require('./routes/posts.js')
const config = require('config')
const cors = require('cors')
const cookieParser = require('cookie-parser')

if(!config.get('privateKey')) {
    console.error('FATAL ERROR: privateKey is not defined.')
    process.exit(1)
}

app.use(express.json())
app.use(cors())
app.use(cookieParser())
//app.use(express.urlencoded({extended: false}))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
//app.use('/api/users', userRoutes)



const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`)
})

