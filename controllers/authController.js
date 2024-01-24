import * as db from "../db/index.js";

const register = (req, res) => {
  console.log(req.body);
  console.log(req.params);
  res.send("REGISTER")
}

const login = (req, res) => {
  res.send("LOGIN")
}

const updateAccount = (req, res) => {
  res.send("UPDATE")
}

const deleteAccount = (req, res) => {
  res.send("DELETE")
}


export {
  register,
  login,
  updateAccount,
  deleteAccount
}