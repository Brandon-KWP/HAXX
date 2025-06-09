const express = require('express');
const router = express.Router();

/* ------------------------------ */

const Notification = require('../models/m-notification.js');
const User = require('../models/m-auth.js');

/* ------------------------------ */

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const user = await User.findById(userId)
            .populate({
                path: 'notifications',
                options: { sort: { 'createdAt': -1 } },
                populate: {
                    path: 'event',
                    model: 'Event'
                }
            }); 

        if (!user) {
            return res.status(404).render('error', {
                message: "Utilisateur non trouvé"
            });
        }

        res.render('notification/index', {
            notifications: user.notifications || [],
            user: user
        });

    } catch (error) {
        console.error('Erreur de récupération des notifications:', error);
        res.status(500).render('error', {
            message: "Erreur lors de la récupération des notifications"
        });
    }
};