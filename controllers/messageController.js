const mongoose = require('mongoose')

const Message = require('../models/message')
const User = require('../models/user')
const Result = require('../models/Result')

class MessageController {

	async insert(incomingMessage) {

		const {emailRecipient} = incomingMessage
	
		try {
			if (!await User.findOne({email : emailRecipient})) {
					let response = new Result(true, "", 'Recipient not found')
					return response
			}

			delete incomingMessage._id
			
			const message = await Message.create(incomingMessage)
			return message
		} 
		catch (err) {
			let response = new Result(true, "", err.message)
			return response
		}
	}

	async delivered (id) {
		try {

			let message = await Message.findOne({_id : id})
			
			if (!message) {
					let response = new Result(true, "", 'Message not found')
					return response
			}

			message.delivered = true
			let messageSaved = await message.updateOne(message)

			return messageSaved
		} 
		catch (err) {
			let response = new Result(true, "", err.message)
			return response
		}
	}

	async checkUndelivered(email) {
		try {
			let messages = await Message.find({emailRecipient : email, delivered: false})

			messages.forEach((message, index, array) => {
				messages[index].toObject()
			})

			return messages
		} 
		catch (err) {
			let response = new Result(true, "", err.message)
			return response
		}
	}
}

module.exports = MessageController;