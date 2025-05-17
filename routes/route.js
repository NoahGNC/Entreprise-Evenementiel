const express = require('express');
const router = express.Router();
const connexion = require('./connexion'); 


const compteRoutes = require('./compte');  
const evenementRoutes = require('./evenement');
const composantRoutes = require('./composant');
const occupeRoutes = require('./occupe');
const demandeRoutes = require('./demande'); 
const prestataireRoutes = require('./prestataire'); 

router.use('/compte', compteRoutes);
router.use('/evenement', evenementRoutes); 
router.use('/composant', composantRoutes);
router.use('/occupe', occupeRoutes);
router.use('/demande', demandeRoutes);
router.use('/prestataire', prestataireRoutes);

module.exports = router;
