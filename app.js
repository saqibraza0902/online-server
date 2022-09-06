require('dotenv').config()
const express = require('express');
const router = require('express').Router();
const cors = require('cors');
const app = express();

app.use(cors())
require('./db/connection');
app.use(express.json())
app.use('/user', require('./Routes/userRoutes'))
app.use('/book', require('./Routes/bookRoutes'))
app.use('/borrow', require('./Routes/borrowRoutes'))

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`listening On Port ${PORT}`)
})
