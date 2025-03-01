// routes/compte.js
const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hachage des mots de passe

// Récupérer tous les clients
router.get('/', (req, res) => {
    const query = 'SELECT id, email, type FROM compte';  // On ne renvoie pas le mot de passe
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des clients:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des clients en format JSON
    });
});

// Ajouter un client
router.post('/', (req, res) => {
    const { email, mot_de_passe, type } = req.body;

    // Vérifier que les champs nécessaires sont présents
    if (!email || !mot_de_passe || !type) {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    // Hachage du mot de passe avant de l'insérer dans la base de données
    const hashedPassword = bcrypt.hashSync(mot_de_passe, 10);  // Hachage avec un coût de 10

    const query = 'INSERT INTO compte (email, mot_de_passe, type) VALUES (?, ?, ?)';
    connexion.query(query, [email, hashedPassword, type], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du client:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.status(201).send('Client ajouté avec succès');
    });
});

// Mettre à jour un client
router.put('/:id', (req, res) => {
    const { id } = req.params;  // Récupérer l'ID du client dans l'URL
    const { email, mot_de_passe, type } = req.body;

    // Vérifier qu'il y a au moins un champ à mettre à jour
    if (!email && !mot_de_passe && !type) {
        return res.status(400).send('Au moins un champ doit être fourni');
    }

    let query = 'UPDATE compte SET ';
    const updates = [];
    const values = [];

    // Préparer les valeurs à mettre à jour
    if (email) {
        updates.push('email = ?');
        values.push(email);
    }
    if (mot_de_passe) {
        const hashedPassword = bcrypt.hashSync(mot_de_passe, 10);  // Hachage du mot de passe
        updates.push('mot_de_passe = ?');
        values.push(hashedPassword);
    }
    if (type) {
        updates.push('type = ?');
        values.push(type);
    }

    // Ajouter la condition WHERE pour spécifier le client à mettre à jour
    query += updates.join(', ') + ' WHERE id = ?';
    values.push(id);

    connexion.query(query, values, (err, results) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du client:', err);
            return res.status(500).send('Erreur serveur');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Client non trouvé');
        }
        res.send('Client mis à jour avec succès');
    });
});

// Supprimer un client
router.delete('/:id', (req, res) => {
    const { id } = req.params;  // Récupérer l'ID du client dans l'URL

    const query = 'DELETE FROM compte WHERE id = ?';
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
