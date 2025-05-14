// routes/route.js
const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Importer la connexion ici

// Importation des autres fichiers de routes si nécessaire
const compteRoutes = require('./compte');  
const evenementRoutes = require('./evenement');
const composantRoutes = require('./composant');
const occupeRoutes = require('./occupe');  // Importation des routes pour 'occupe'
const demandeRoutes = require('./demande');  // Importation des routes pour 'demande'

router.use('/compte', compteRoutes);  // Utilisation des routes liées à la table 'compte'
router.use('/evenement', evenementRoutes);  // Utilisation des routes liées à la table 'evenement'
router.use('/composant', composantRoutes);  // Utilisation des routes liées à la table 'composant'
router.use('/occupe', occupeRoutes);  // Utilisation des routes liées à la table 'occupe'
router.use('/demande', demandeRoutes);  // Utilisation des routes liées à la table 'demande'

module.exports = router;
