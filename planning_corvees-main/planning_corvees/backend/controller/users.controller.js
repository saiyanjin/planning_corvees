const { getDb } = require("../config/mongo");

exports.loginUser = async (req, res) => {
  const { prenom, mdp } = req.body;
  const db = getDb();
  const user = await db.collection("users").findOne({ prenom, mdp });

  if (!user) {
    return res.status(400).json({ success: false, message: "Identifiants incorrects" });
  }

  res.json({ success: true, prenom: user.prenom, role: user.role });
};
