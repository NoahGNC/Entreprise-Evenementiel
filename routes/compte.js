const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hachage des mots de passe


router.get('/', (req, res) => {
    const query = 'SELECT ID_Compte, Mail, Type FROM Compte';  // On ne renvoie pas le mot de passe
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des comptes:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des comptes en format JSON
    });
});

router.post('/', (req, res) => {
    const { email, mot_de_passe, type } = req.body;
    console.log(req.body)

    // Vérifier que les champs nécessaires sont présents
    if (!email || !mot_de_passe || !type) {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    // Hachage du mot de passe avant de l'insérer dans la base de données
    const hashedPassword = bcrypt.hashSync(mot_de_passe, 10);  // Hachage avec un coût de 10

    const query = 'INSERT INTO Compte (Mail, Mdp, Type) VALUES (?, ?, ?)';
    connexion.query(query, [email, hashedPassword, type], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du compte:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.status(201).send('Client ajouté avec succès');
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;  // Récupérer l'ID du client dans l'URL

    const query = 'DELETE FROM Compte WHERE ID_Compte = ?';
    connexion.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression du compte:', err);
            return res.status(500).send('Erreur serveur');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Compte non trouvé');
        }
        res.send('Compte supprimé avec succès');
    });
});

module.exports = router;  // Exporter les routes pour les utiliser dans le fichier principal
