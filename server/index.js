const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')




const app = express()

// Middleware
app.use(bodyParser.json())
app.use(fileUpload)
app.use(cors())

const fractal = require('./routes/api/fractal')

app.use('/api/fractal', fractal)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Sever started on port ${port}`))