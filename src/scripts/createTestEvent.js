require('dotenv').config();
const mongoose = require('mongoose');

const Event = require('../models/m-event.js');

async function createTestEvent() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const testEvent = new Event({
            nom: "Stadium Cup 2v2",
            image: "https://images.gamewatcherstatic.com/screenshot/image/1/da/171631/00187659.jpg",
            description: "Un tournoi 2v2 sur Trackmania Stadium avec des équipes de haut niveau.",
            date: "2025-05-25",
            ville: "bruxelles",
            places_available: 64
        });

        await testEvent.save();
        console.log('Événement test créé avec ID:', testEvent._id);
        
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        mongoose.connection.close();
    }
}

createTestEvent();