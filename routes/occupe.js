const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Connexion à la base de données


router.get('/', (req, res) => {
    const query = 'SELECT ID_Event, ID_Compte, ID_Comp FROM occupe';
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de occupe:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des clients en format JSON
    });
});

module.exports = router;   // Exporter les routes pour les utiliser dans le fichier principal