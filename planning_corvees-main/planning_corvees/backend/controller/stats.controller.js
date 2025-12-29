const { getDb } = require("../config/mongo");

exports.getStatsByYear = async (req, res) => {
  try {
    const annee = Number(req.params.annee);
    const db = getDb();

    const stats = await db.collection("plannings").aggregate([
      { $match: { annee } },
      { $unwind: "$semaines" },
      { $group: { _id: "$semaines.assigneA", total: { $sum: 1 } } },
      { $sort: { total: 1 } }
    ]).toArray();

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
