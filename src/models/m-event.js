const mongoose = require("mongoose");

// schema pour les events
const EventShema = new mongoose.Schema({
  nom: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  ville: String,
  places_available: Number,
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// defenir le modèle + bien mettre le nom de la base de donnée
const Event = mongoose.model("Event", EventShema);

// exportation du modele
module.exports = Event;
