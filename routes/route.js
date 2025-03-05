// routes/route.js
const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Importer la connexion ici

// Importation des autres fichiers de routes si nécessaire
const compteRoutes = require('./compte');  
const clientRoutes = require('./client');
const prestataireRoutes = require('./prestataire');
const evenementRoutes = require('./evenement');
const composantRoutes = require('./composant');

router.use('/compte', compteRoutes);  // Utilisation des routes liées à la table 'compte'
router.use('/client', clientRoutes);  // Utilisation des routes liées à la table 'client'
router.use('/prestataire', prestataireRoutes);  // Utilisation des routes liées à la table 'prestataire'
router.use('/evenement', evenementRoutes);  // Utilisation des routes liées à la table 'evenement'
router.use('/composant', composantRoutes);  // Utilisation des routes liées à la table 'composant'

module.exports = router;
