import * as db from "../db/index.js";

const getEntry = (req, res) => {
  res.send("GET ENTRY")
}

const newEntry = (req, res) => {
  res.send("NEW ENTRY")
}

const updateEntry = (req, res) => {
  res.send("UPDATE ENTRY")
}

const deleteEntry = (req, res) => {
  res.send("DELETE ENTRY")
}


export {
  getEntry,
  newEntry,
  updateEntry,
  deleteEntry
}