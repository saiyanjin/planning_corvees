const express = require("express");
const router = express.Router();
const { getDb } = require("../config/mongo");

// GET /api/stats/:annee
router.get("/:annee", async (req, res) => {
  try {
    const annee = Number(req.params.annee);
    const db = getDb();

    const stats = await db.collection("plannings").aggregate([
      { $match: { annee } },
      { $unwind: "$semaines" },
      { $group: { _id: "$semaines.assigneA", total: { $sum: 1 } } },
      { $sort: { total: 1 } } // ordre croissant
    ]).toArray();

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
