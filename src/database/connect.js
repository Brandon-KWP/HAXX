const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database conncecté....");
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectDb;