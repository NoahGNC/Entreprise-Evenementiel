const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Connexion à la base de données


router.get('/listeComp/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    if (!id) {  // Vérifier si l'ID de l'événement est fourni
        return res.status(400).send('ID de l\'événement requis');
    }
    const query = 'SELECT d.ID_Event, d.ID_Comp, c.Nom, c.Image, d.Quantite FROM demande d JOIN Composant c ON d.ID_Comp = c.ID_Comp WHERE ID_Event = ?';
    connexion.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de occupe:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des clients en format JSON
    });
});

module.exports = router;   // Exporter les routes pour les utiliser dans le fichier principal