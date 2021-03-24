const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

mongoose.connect('mongodb://127.0.0.1/projectChat', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

module.exports = mongoose