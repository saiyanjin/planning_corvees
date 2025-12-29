// planning.model.js
// Structure d’un planning
module.exports = {
  annee: Number,
  semaines: [
    {
      date: Date,
      assigneA: String
    }
  ]
};
