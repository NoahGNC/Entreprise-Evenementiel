const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hachage des mots de passe


router.get('/', (req, res) => {
    const query = 'SELECT ID_Compte, Mail, Nom, Prenom, Type FROM Compte';  // On ne renvoie pas le mot de passe
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des comptes:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des comptes en format JSON
    });
});

router.get('/prestataire', (req, res) => {
    const query = 'SELECT ID_Compte, Mail, Nom, Prenom, Type FROM Compte WHERE Type = "Prestataire"';  // On ne renvoie pas le mot de passe
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des prestataires:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des prestataires en format JSON
    });
});

router.get('/client', (req, res) => {
    const query = 'SELECT ID_Compte, Mail, Nom, Prenom, Type FROM Compte WHERE Type = "Client"';  // On ne renvoie pas le mot de passe
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des prestataires:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des prestataires en format JSON
    });
});

router.post('/connexion', (req, res) => {
    const { email, mdp } = req.body;

    if (!email || !mdp) {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    const query = 'SELECT Type, Mdp FROM Compte WHERE Mail = ?';
    connexion.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erreur lors de la requête', err);
            return res.status(500).send('Erreur serveur');
        }

        if (results.length === 0) {
            return res.status(401).send('Mot de passe incorrect');
        }

        const user = results[0];
        bcrypt.compare(mdp, user.Mdp, (err, isMatch) => {
            if (err) {
                console.error('Erreur bcrypt', err);
                return res.status(500).send('Erreur serveur');
            }

            if (!isMatch) {
                return res.status(401).send('Mot de passe incorrect');
            }

            req.session.user = {
                email,
                type: user.Type
            };
            
            return res.status(200).json({
                success: true,
                type: user.Type
              });
              
            
        });
    });
});


router.post('/creation', (req, res) => {
    const { email, nom, prenom, mdp, choixSituation } = req.body;

    if (!email || !mdp || !nom || !prenom || !choixSituation) {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    const hashedPassword = bcrypt.hashSync(mdp, 10);

    const query = 'INSERT INTO Compte (Mail, Nom, Prenom, Mdp, Type) VALUES (?, ?, ?, ?, ?)';
    connexion.query(query, [email, nom, prenom, hashedPassword, choixSituation], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du compte:', err);
            return res.status(500).send('Compte déja existant');
        }
        return res.status(200).json({
            success: true,
            type: choixSituation
          });
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
