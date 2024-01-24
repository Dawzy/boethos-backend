import ErrorResponse from "../utils/errorResponse.js";

const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	// Log error
	console.log(err.stack);

	// Mongoose bad ObjectId
	if (err.name === "CastError") {
		const message = `Project with id ${err.value} not found.`;
		error = new ErrorResponse(message, 404);
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		const message = "Duplicate field value entered";
		error = new ErrorResponse(message, 400);
	}

	// Mongoose validation error
	if (err.name === "ValidationError") {
		// Extract all the error messages
		const message = Object.values(err.errors).map(val => val.message);
		error = new ErrorResponse(message, 400);
	}

	// Return the error object
	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server error."
	});
}

export default errorHandler;