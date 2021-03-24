const mongoose = require('../database/index')

const MessageSchema = new mongoose.Schema({
    emailSender: {
        type: String,
        required: true,
    },
    emailRecipient: {
        type: String,
        required: true,
	},
    message: {
        type: String,
        required: true,
    },                                      
    delivered: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message;