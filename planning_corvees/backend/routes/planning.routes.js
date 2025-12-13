const express = require("express");
const router = express.Router();
const { getDb } = require("../config/mongo");

router.post("/save", async (req, res) => {
  try {
    const { year, semaines } = req.body;
    if (!year || !semaines) {
      return res.status(400).json({ success: false, message: "Données manquantes" });
    }

    const db = getDb();

    await db.collection("plannings").deleteOne({ annee: year });

    const doc = {
      annee: year,
      semaines: semaines.map(s => ({
        date: new Date(s.date.split("/").reverse().join("-")),
        assigneA: s.assigneA
      }))
    };

    const result = await db.collection("plannings").insertOne(doc);

    res.json({ success: true, message: "Planning sauvegardé", id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:annee", async (req, res) => {
  try {
    const annee = Number(req.params.annee);
    const db = getDb();

    const planning = await db.collection("plannings").findOne({ annee });

    if (!planning) {
      return res.json({ semaines: [] }); // pas de planning → générer par défaut côté client
    }

    res.json(planning);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
