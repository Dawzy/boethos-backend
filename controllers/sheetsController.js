import * as db from "../db/index.js";
import asyncHandler from "../middleware/async.js";
import { extractToken } from "../utils/authUtils.js";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse.js";

/*
	@desc Get all the sheets that belong to a user
	@route /api/v1/sheets
	@access Private
  @method GET
*/
const getSheets = asyncHandler(async (req, res, next) => {
  // Get token
  const token = extractToken( req.headers["authorization"] );
  const { id } = await jwt.verify(token, process.env.JWT_SECRET);

  // Get all sheets associated with id
  const query = "SELECT id, name FROM sheets WHERE user_id = $1"
  const values = [id];
  const { rows } = await db.query(query, values);

  // Send em back
  res.status(200).json({
    success: true,
    data: rows
  });
});

/*
	@desc Get a sheets data
	@route /api/v1/sheets/sheetId
	@access Private
  @method GET
*/
const getSheet = asyncHandler(async (req, res, next) => {
  // Get token
  const token = extractToken( req.headers["authorization"] );
  const { id } = await jwt.verify(token, process.env.JWT_SECRET);
  const { sheetId } = req.params;

  next(new ErrorResponse("Unavailable.", 503));
});

/*
	@desc Create a sheet for a user
	@route /api/v1/sheets
	@access Private
  @method POST
*/
const createSheet = asyncHandler(async (req, res, next) => {
  // Get token & params
  const token = extractToken( req.headers["authorization"] );
  const { id } = await jwt.verify(token, process.env.JWT_SECRET);
  const { name } = req.body;

  if (!name)
    return next(new ErrorResponse("Name of new sheet is not specified.", 400));
  
  // Insert new sheet
  const query = "INSERT INTO sheets(user_id, name, created_at) VALUES($1, $2, NOW()) RETURNING id";
  const values = [id, name];
  const { rows } = await db.query(query, values);

  const { id: sheetId } = rows[0];

  res.status(201).json({
    success: true,
    data: {
      sheetId
    }
  });
});

/*
	@desc Update a property for a sheet
	@route /api/v1/sheets/sheetId
	@access Private
  @method PATCH
*/
const updateSheet = asyncHandler(async (req, res, next) => {
  // Get params
  const token = extractToken( req.headers["authorization"] );
  const { col, val } = req.body;
  const { sheetId } = req.params;
  const { id } = await jwt.verify(token, process.env.JWT_SECRET);

  // Validate column
  switch (col) {
    case "id":
    case "user_id":
      return next(new ErrorResponse(`Cannot change ${col} field.`, 400));

    case undefined:
      return next(new ErrorResponse("No field specified.", 400));
  }

  // Validate value
  if (!val)
    return next(new ErrorResponse("No new value specified.", 400));

  // Check if column exists in database
  const query1 = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'sheets'"
  const { rows } = await db.query(query1, []);
  const colExists = rows.find(obj => col === obj.column_name);

  if (!colExists)
    return next(new ErrorResponse("Field does not exist"), 400);

  // Query the change
  const query2 = `UPDATE sheets SET ${col} = $1 WHERE id = $2 AND user_id = $3`;
  const values = [val, sheetId, id];

  await db.query(query2, values);

  res.status(200).json({
    success: true
  });
});

/*
	@desc Delete a sheet
	@route /api/v1/sheets/sheetId
	@access Private
  @method DELETE
*/
const deleteSheet = asyncHandler(async (req, res, next) => {
    // Get params
    const token = extractToken( req.headers["authorization"] );
    const { sheetId } = req.params;
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);

    // Query the deletion
    const query = "DELETE FROM sheets WHERE id = $1 AND user_id = $2";
    const values = [sheetId, id];
    await db.query(query, values);

    res.status(200).json({
      success: true
    });
});


export {
  getSheets,
  getSheet,
  createSheet,
  updateSheet,
  deleteSheet
}