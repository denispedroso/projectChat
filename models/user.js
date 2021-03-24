const mongoose = require('../database/index')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },                                      
    checked: {
        type: Boolean,
        default: false
    },
    link: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

})

UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User;