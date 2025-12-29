const express = require("express");
const router = express.Router();
const { getStatsByYear } = require("../controller/stats.controller");

router.get("/:annee", getStatsByYear);

module.exports = router;
