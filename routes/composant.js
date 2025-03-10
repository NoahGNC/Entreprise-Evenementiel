const express = require('express');
const router = express.Router();
const connexion = require('./connexion');


router.get('/', (req, res) => {
    const query = 'SELECT ID_Comp, Nom, Description, Image, Prix_Estime FROM Composant';
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des composants:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const {nom, desc, img, prix } = req.body;
    console.log(req.body)

    if (!nom || !desc || !img || !prix) {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    const query = 'INSERT INTO Composant (Nom, Description, Image, Prix_Estime) VALUES (?, ?, ?, ?)';
    connexion.query(query, [nom, desc, img, prix], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du composant:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.status(200).send("Composant ajouté avec succès")
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params; 

    const query = 'DELETE FROM Composant WHERE ID_Comp = ?';
    connexion.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression du composant:', err);
            return res.status(500).send('Erreur serveur');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Composant non trouvé');
        }
        res.send('Composant supprimé avec succès');
    });
});

module.exports = router;
