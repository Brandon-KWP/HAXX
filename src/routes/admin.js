const express = require("express");
const router = express.Router();

/* ------------------------------ */

const isAdmin = require('../middleware/isAdmin');
const adminController = require("../controllers/c-admin.js");

/* ------------------------------ */

// Route pour afficher le tableau de bord
router.get("/admin/dashboard", isAdmin, adminController.dashboard);

// Routes pour gérer les événements
router.get("/admin/events", isAdmin, adminController.getEvents);
router.post("/admin/events/add", isAdmin, adminController.addEvent);
router.post("/admin/events/edit/:id", isAdmin, adminController.editEvent);
router.post("/admin/events/delete/:id", isAdmin, adminController.deleteEvent);

// Routes pour gérer les projets
router.get("/admin/projects", isAdmin, adminController.getProjects);
router.post("/admin/projects/edit/:id", isAdmin, adminController.editProject);
router.post("/admin/projects/delete/:id", isAdmin, adminController.deleteProject);

// Routes pour gérer les membres
router.get("/admin/members", isAdmin, adminController.getMembers);
router.post("/admin/members/edit/:id", isAdmin, adminController.updateMember);
router.post("/admin/members/delete/:id", isAdmin, adminController.deleteMember);

/* ------------------------------ */

module.exports = router;