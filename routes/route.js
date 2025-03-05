// routes/route.js
const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Importer la connexion ici

// Importation des autres fichiers de routes si nécessaire
const compteRoutes = require('./compte');  
const clientRoutes = require('./client');

router.use('/compte', compteRoutes);  // Utilisation des routes liées à la table 'compte'
router.use('/client', clientRoutes);  // Utilisation des routes liées à la table 'client'

module.exports = router;
