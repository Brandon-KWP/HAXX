const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    pseudo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user'},
    password: { type: String, required: true, unique: true },
    pseudo_discord: { type: String, required: true, unique: true },
    pseudo_ubisoft: { type: String, required: true, unique: true },
    
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification"
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }]
}, {
    timestamps: true
});

// defenir le modèle + bien mettre le nom de la base de donnée
const User = mongoose.model("Auth", userSchema);

// exportation du modele
module.exports = User;