require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/m-auth.js');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const hashedPassword = await bcrypt.hash('adminpassword', 10);
        
        const admin = new User({
            pseudo: 'admin',
            email: 'admin@haxx.com',
            password: hashedPassword,
            role: 'admin',
            pseudo_discord: 'admin#0000',
            pseudo_ubisoft: 'admin_ubi'
        });

        await admin.save();
        console.log('Admin créé avec succès');
        
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        mongoose.connection.close();
    }
}

createAdmin();