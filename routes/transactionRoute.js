const express = require("express");
const { createTransaction, getTransactions } = require("../controllers/transaction");
const router = express.Router();

router.post("/createtransaction", createTransaction);

router.get("/gettransactions", getTransactions);

module.exports = router;