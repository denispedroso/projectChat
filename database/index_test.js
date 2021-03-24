const mongoose = require('mongoose')

// It's just so easy to connect to the MongoDB Memory Server 
// By using mongoose.connect

mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
    // if (err) {
    //     console.error(err)
    //     // process.exit(1)
    // }
}).catch((err) => {
    console.log(err);
})

module.exports = mongoose