import * as db from "../db/index.js";
import ErrorResponse from "../utils/errorResponse.js";
import { extractToken, inLengthRange, isEmail, SALT_ROUNDS, validatePassword } from "../utils/authUtils.js";
import bcrypt from "bcrypt";
import asyncHandler from "../middleware/async.js";
import jwt from "jsonwebtoken";

/*
	@desc Register a new user
	@route /api/v1/auth/
	@access Private
  @method POST
*/
const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // First name cap 1-50
  if (!inLengthRange(firstName, 1, 50))
    return next(new ErrorResponse("First name must be between 1-50 characters."), 400)

  // Last name cap 1-50
  if (!inLengthRange(lastName, 1, 50))
    return next(new ErrorResponse("Last name must be between 1-50 characters."), 400)

  // Validate email
  if (!inLengthRange(email, 6, 255))
    return next(new ErrorResponse("Email must be between 6-255 characters."), 400)

  if (!isEmail(email))
    return next(new ErrorResponse("Invalid email."), 400)

  // Validate password
  const { success, message } = validatePassword(password);
  if (!success)
    return next(new ErrorResponse(message), 400);

  // Password salt & hashing
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  
  // Storage
  const query = "INSERT INTO users(name, surname, email, password, created_at) VALUES($1, $2, $3, $4, NOW()) RETURNING id"
  const values = [firstName, lastName, email, hash]
  const { rows } = await db.query(query, values);
  
  const { id } = rows[0];
  
  // Token generation
  const token = await jwt.sign({
    id,
    email,
  }, process.env.JWT_SECRET);
  
  // Send back token
  res.status(201).json({
    success: true,
    token
  });
});

/*
	@desc Login a user
	@route /api/v1/auth/
	@access Private
  @method GET
*/
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Get account with email
  const query = "SELECT id, email, password FROM users WHERE email = $1";
  const values = [email];
  const { rows } = await db.query(query, values);

  // No account exists with the given email
  if (rows.length === 0)
    return next(new ErrorResponse("Email does not exist.", 400));

  // Compare passwords
  const { id, password: hashedPassword } = rows[0];
  const isCorrectPassword = await bcrypt.compare(password, hashedPassword);  

  if (!isCorrectPassword)
    return next(new ErrorResponse("Wrong password.", 400));

  // Token generation
  const token = await jwt.sign({
    id,
    email,
  }, process.env.JWT_SECRET);
  
  // Send back token
  res.status(200).json({
    success: true,
    token
  });
});

/*
	@desc Change a field in a user's data
	@route /api/v1/auth/
	@access Private
  @method PATCH
*/
const updateAccount = asyncHandler(async (req, res, next) => {
  // Get params
  const token = extractToken( req.headers["authorization"] );
  const { col, val } = req.body;
  const { id } = await jwt.verify(token, process.env.JWT_SECRET);

  // Validate column
  switch (col) {
    case "id":
    case "email":
      return next(new ErrorResponse(`Cannot change ${col} field.`, 400));
    
    case "password":
      return next(new ErrorResponse("Wrong route for password change.", 403));

    case undefined:
      return next(new ErrorResponse("No field specified.", 400));
  }

  // Validate value
  if (!val)
    return next(new ErrorResponse("No new value specified.", 400));

  // Check if column exists in database
  const query1 = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users'"
  const { rows } = await db.query(query1, []);
  const colExists = rows.find(obj => col === obj.column_name);

  if (!colExists)
    return next(new ErrorResponse("Field does not exist"), 400);

  // Query the change
  const query2 = `UPDATE users SET ${col} = $1 WHERE id = $2`;
  const values = [val, id];

  await db.query(query, values);

  res.status(200).json({
    success: true
  });
});

/*
	@desc Delete a user from the database
	@route /api/v1/auth/
	@access Private
  @method DELETE
*/
const deleteAccount = asyncHandler(async (req, res, next) => {
  // Get token
  const token = extractToken( req.headers["authorization"] );
  const { id } = await jwt.verify(token, process.env.JWT_SECRET);

  // Query
  const query = "DELETE FROM users WHERE id = $1";
  const values = [id];
  await db.query(query, values);

  res.status(200).json({
    success: true
  });
});

/*
	@desc Change a user's password
	@route /api/v1/auth/pass-change
	@access Private
  @method POST
*/
const changePassword = asyncHandler(async (req, res, next) => {
  // Get params
  const token = extractToken( req.headers["authorization"] );
  const { oldPassword, newPassword } = req.body;
  const { id } = await jwt.verify(token, process.env.JWT_SECRET);

  // Check old password
  const query1 = "SELECT id, password WHERE id = $1";
  const vals = [id]
  const { rows } = await db.query(query1, vals)

  // No account exists with the given email
  if (rows.length === 0)
    return next(new ErrorResponse("Account does not exist.", 400));

  // Compare passwords
  const { password: hashedPassword } = rows[0];
  const isCorrectPassword = await bcrypt.compare(oldPassword, hashedPassword);  

  if (!isCorrectPassword)
    return next(new ErrorResponse("Wrong password.", 400));

  // Password validation
  const { success, message } = validatePassword(newPassword);
  if (!success)
    return next(new ErrorResponse(message), 400);

  // Hashing
  const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  // Update new password
  const query2 = "UPDATE users SET password = $1 WHERE id = $2"
  const values = [hash, id]
  await db.query(query2, values)

  res.status(200).json({
    success: true
  });
});

/*
	@desc Reset a user's password
	@route /api/v1/auth/pass-change
	@access Private
  @method PATCH
*/
const resetPassword = asyncHandler(async (req, res, next) => {
  // TO DO
});

export {
  register,
  login,
  updateAccount,
  deleteAccount,
  changePassword,
  resetPassword
}