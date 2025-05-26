const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  auteur: { type: String, required: true },
  nom: { type: String, required: true },
  author: { type: String, required: true },
  gold: { type: String, required: true },
  silver: { type: String, required: true },
  bronze: { type: String, required: true },
});

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, required: true },
    cards: [cardSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Projet", projectSchema);
