import * as db from "../db/index.js";

const getSheets = (req, res) => {
  res.send("SHEETS")
}

const getSheet = (req, res) => {
  res.send("SHEET")
}

const createSheet = (req, res) => {
  res.send("CREATE SHEET")
}

const updateSheet = (req, res) => {
  res.send("UPDATE SHEET")
}

const deleteSheet = (req, res) => {
  res.send("DELETE SHEET")
}


export {
  getSheets,
  getSheet,
  createSheet,
  updateSheet,
  deleteSheet
}