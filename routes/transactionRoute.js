const express = require("express");
const router = express.Router();

const { createTransaction, getTransactions } = require("../controllers/transaction");

router.post("/createtransaction", createTransaction);

router.get("/gettransactions", getTransactions);

module.exports = router;