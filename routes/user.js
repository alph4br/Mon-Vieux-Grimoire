// Récupérer les packages
const express = require('express');
const router = express.Router();

// Récupérer le controlleur
const userCtrl = require('../controllers/user');

// Les routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exporter le router
module.exports = router;