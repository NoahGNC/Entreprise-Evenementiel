const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hachage des mots de passe


router.get('/', (req, res) => {
    const query = 'SELECT Mail_Client, Nom, Prenom FROM Client';  // On ne renvoie pas le mot de passe
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des clients:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des clients en format JSON
    });
});

router.post('/', (req, res) => {
    const { email, nom, prenom } = req.body;

    // Vérifier que les champs nécessaires sont présents
    if (!email || !nom || !prenom) {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    const query = 'INSERT INTO Client (Mail_Client, Nom, Prenom) VALUES (?, ?, ?)';
    connexion.query(query, [email, nom, prenom], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du client:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.status(201).send('Client ajouté avec succès');
    });
});

router.delete('/:id', (req, res) => {
    const { mail } = req.params;  // Récupérer le mail du client dans l'URL

    const query = 'DELETE FROM Client WHERE Mail_Client = ?';
    connexion.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression du client:', err);
            return res.status(500).send('Erreur serveur');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Client non trouvé');
        }
        res.send('Client supprimé avec succès');
    });
});

module.exports = router;  // Exporter les routes pour les utiliser dans le fichier principal
