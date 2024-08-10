import * as db from "../db/index.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";

/*
	@desc Get all the entries that belong to a sheet
	@route /api/v1/sheets/sheetId/entries/
	@access Private
  @method GET
*/
const getEntries = asyncHandler(async (req, res, next) => {
  // Get params
  const token = extractToken( req.headers["authorization"] );
  const { sheetId } = req.params;
  const { id } = await jwt.verify(token, process.env.JWT_SECRET);

  // Get all entries associated with id
  const query = "SELECT * FROM entries WHERE id = $1 AND sheet_id = $2"
  const values = [sheetId, id];
  const { rows } = await db.query(query, values);
  
  // Send entries back
  res.status(200).json({
    success: true,
    data: rows
  });
});

/*
	@desc Get an entry's data
	@route /api/v1/sheets/sheetId/entries/entryId
	@access Private
  @method GET
*/
const getEntry = asyncHandler(async (req, res, next) => {
  // Get params
  const token = extractToken( req.headers["authorization"] );
  const { sheetId, entryId } = req.params;
  const { id } = await jwt.verify(token, process.env.JWT_SECRET);

  next(new ErrorResponse("Unavailable.", 503));
});

/*
	@desc Create a new entry
	@route /api/v1/sheets/sheetId/entries/
	@access Private
  @method POST
*/
const newEntry = asyncHandler(async (req, res, next) => {
  // Get params
  const token = extractToken( req.headers["authorization"] );
  const { sheetId } = req.params;
  const { name } = req.params;
  
  // Verify token before inserting. We have no need
  await jwt.verify(token, process.env.JWT_SECRET);

  // Insert new entry
  const query = "INSERT INTO entries(name, mark_count, last_mark, created_at, sheet_id) VALUES($1, 0, 0, NOW(), $2) RETURNING id";
  const values = [name, sheetId];
  const { rows } = await db.query(query, values);
  const { id: entryId } = rows[0];

  res.status(201).json({
    success: true,
    data: {
      entryId
    }
  });
});

/*
	@desc Update an entry's data
	@route /api/v1/sheets/sheetId/entries/entryId
	@access Private
  @method PATCH
*/
const updateEntry = asyncHandler(async (req, res, next) => {
  // Get params
  const token = extractToken( req.headers["authorization"] );
  const { col, val } = req.body;
  const { sheetId, entryId } = req.params;
  
  await jwt.verify(token, process.env.JWT_SECRET);

  // Validate column
  switch (col) {
    case "id":
    case "sheet_id":
      return next(new ErrorResponse(`Cannot change ${col} field.`, 400));

    case undefined:
      return next(new ErrorResponse("No field specified.", 400));
  }

  // Validate value
  if (!val)
    return next(new ErrorResponse("No new value specified.", 400));

  // Check if column exists in database
  const query1 = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'entries'"
  const { rows } = await db.query(query1, []);
  const colExists = rows.find(obj => col === obj.column_name);

  if (!colExists)
    return next(new ErrorResponse("Field does not exist"), 400);

  // Query the change
  const query2 = `UPDATE entries SET ${col} = $1 WHERE id = $2 AND sheet_id = $3`;
  const values = [val, entryId, sheetId];

  await db.query(query2, values);

  res.status(200).json({
    success: true
  });
});

/*
	@desc Delete an entry from a sheet
	@route /api/v1/sheets/sheetId/entries/entryId
	@access Private
  @method DELETE
*/
const deleteEntry = asyncHandler(async (req, res, next) => {
  // Get params
  const token = extractToken( req.headers["authorization"] );
  const { sheetId, entryId } = req.params;
  
  await jwt.verify(token, process.env.JWT_SECRET);

  // Query the deletion
  const query = "DELETE FROM entries WHERE id = $1 AND sheet_id = $2";
  const values = [entryId, sheetId];
  await db.query(query, values);

  res.status(200).json({
    success: true
  });
});

export {
  getEntries,
  getEntry,
  newEntry,
  updateEntry,
  deleteEntry
}