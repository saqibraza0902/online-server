const mongoos = require('mongoose');

const DB = process.env.DATABASE
//Database Connection
mongoos.connect(DB).then(() => {
    console.log(`connection successfull`)
}).catch((err) => console.log('No connection'))