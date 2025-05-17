const express = require('express');
const router = express.Router();
const connexion = require('./connexion'); 


const compteRoutes = require('./compte');  
const evenementRoutes = require('./evenement');
const composantRoutes = require('./composant');
const demandeRoutes = require('./demande'); 
const prestataireRoutes = require('./prestataire'); 
const devisRoutes = require('./devis');

router.use('/compte', compteRoutes);
router.use('/evenement', evenementRoutes); 
router.use('/composant', composantRoutes);
router.use('/demande', demandeRoutes);
router.use('/prestataire', prestataireRoutes);
router.use('/devis', devisRoutes);

module.exports = router;
