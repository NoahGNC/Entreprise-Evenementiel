const express = require('express');
const router = express.Router();
const connexion = require("./connexion")

router.get('/compte', (req, res) => {
    const query = 'SELECT id, email, type FROM compte';  // On ne renvoie pas le mot de passe pour des raisons de sécurité
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des clients:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoie les résultats au format JSON
    });
});

router.post('/compte', (req, res) => {
    const { email, mot_de_passe, type } = req.body;  // Récupérer les données envoyées dans le corps de la requête
    
    if (!email || !mot_de_passe || !type) {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    // Hashage du mot de passe avant d'insérer dans la base (tu devrais utiliser une bibliothèque comme bcrypt)
    const hashedPassword = hashPassword(mot_de_passe);  // Remplace par une fonction de hachage appropriée, comme bcrypt

    const query = 'INSERT INTO compte (email, mot_de_passe, type) VALUES (?, ?, ?)';
    connection.query(query, [email, hashedPassword, type], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du client:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.status(201).send('Client ajouté avec succès');
    });
});


router.put('/compte/:id', (req, res) => {
    const { id } = req.params;  // Récupérer l'ID du client à mettre à jour
    const { email, mot_de_passe, type } = req.body;  // Récupérer les nouvelles valeurs

    if (!email && !mot_de_passe && !type) {
        return res.status(400).send('Au moins un champ doit être fourni');
    }

    let query = 'UPDATE compte SET ';
    const updates = [];
    const values = [];

    if (email) {
        updates.push('email = ?');
        values.push(email);
    }
    if (mot_de_passe) {
        // Hashage du mot de passe avant la mise à jour
        values.push(hashPassword(mot_de_passe));  // Utiliser la fonction de hachage appropriée
        updates.push('mot_de_passe = ?');
    }
    if (type) {
        updates.push('type = ?');
        values.push(type);
    }

    query += updates.join(', ') + ' WHERE id = ?';
    values.push(id);

    connection.query(query, values, (err, results) => {
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

router.delete('/compte/:id', (req, res) => {
    const { id } = req.params;  // Récupérer l'ID du client à supprimer
    const query = 'DELETE FROM compte WHERE id = ?';

    connection.query(query, [id], (err, results) => {
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

module.exports = router;