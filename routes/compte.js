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
            return res.status(401).send('Utilisateur non trouvé');
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

            if(user.Type == "Client")
            {
                res.redirect('/event');
            }
            else if(user.Type == "Prestataire")
            {
                res.redirect("/prestataire")
            }
            else if(user.Type == "Admin")
            {
                res.redirect("/admin")
            }
            
        });
    });
});


router.post('/creation', (req, res) => {
    const { email, nom, prenom, mdp, choixSituation } = req.body;
    console.log(req.body)
    console.log("Email : " + email)
    console.log("Nom : " + nom)
    console.log("Prenom : " + prenom)
    console.log("Mdp : " + mdp)
    console.log("Situation : " + choixSituation)

    // Vérifier que les champs nécessaires sont présents
    if (!email || !mdp || !nom || !prenom || !choixSituation) {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    // Hachage du mot de passe avant de l'insérer dans la base de données
    const hashedPassword = bcrypt.hashSync(mdp, 10);  // Hachage avec un coût de 10

    const query = 'INSERT INTO Compte (Mail, Nom, Prenom, Mdp, Type) VALUES (?, ?, ?, ?, ?)';
    connexion.query(query, [email, nom, prenom, hashedPassword, choixSituation], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du compte:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.status(201).send('Compte ajouté avec succès');
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
