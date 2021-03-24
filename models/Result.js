class Result {

	constructor(error, data, message) {

		if (error) {
			this.message = message 
		} else {
			this.message = "Ok"
		}

		this.error = error
		this.data = data
	}
}

module.exports = Result