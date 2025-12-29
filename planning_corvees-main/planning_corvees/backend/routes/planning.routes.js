const express = require("express");
const router = express.Router();
const { savePlanning, getPlanningByYear } = require("../controller/planning.controller");

router.post("/save", savePlanning);
router.get("/:annee", getPlanningByYear);

module.exports = router;
