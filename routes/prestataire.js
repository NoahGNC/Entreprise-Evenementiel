const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Connexion à la base de données


router.get('/', (req, res) => {
    const query = 'SELECT Mail_Prest, Nom, Prenom FROM Prestataire';
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des prestataires:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des prestataires en format JSON
    });
});

router.post('/', (req, res) => {
    const { email, nom, prenom } = req.body;
    console.log(req.body)
    
    // Vérifier que les champs nécessaires sont présents
    if (!email || !nom || !prenom) {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    const query = 'INSERT INTO Prestataire (Mail_Prest, Nom, Prenom) VALUES (?, ?, ?)';
    connexion.query(query, [email, nom, prenom], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du prestataire:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.status(201).send('prestataire ajouté avec succès');
    });
});

router.delete('/:id', (req, res) => {
    const { mail } = req.params;  // Récupérer le mail du prestataire dans l'URL

    const query = 'DELETE FROM Prestataire WHERE Mail_Prest = ?';
    connexion.query(query, [mail], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression du prestataire:', err);
            return res.status(500).send('Erreur serveur');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Prestataire non trouvé');
        }
        res.send('Prestataire supprimé avec succès');
    });
});

module.exports = router;  // Exporter les routes pour les utiliser dans le fichier principal
