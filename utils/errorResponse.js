/*
	General Error class that contains:
	- message
	- statusCode
*/
class ErrorResponse extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
	}
}

export default ErrorResponse;