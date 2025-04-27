const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Connexion à la base de données


router.get('/all', (req, res) => {
    const query = 'SELECT ID_Event, Nom, Date_Debut, Mail_Client, Etat FROM Evenement';
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des evenements:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des evenements en format JSON
    });
});

router.get('/', (req, res) => {
    // On récupère la variable de session pour avoir l'id du gars
    console.log(req.session)
    const query = 'SELECT ID_Event, Nom, Date_Debut, Mail_Client, Etat FROM Evenement';
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des evenements:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);  // Envoi des données des evenements en format JSON
    });
});

router.post('/', (req, res) => {
    const { nom, desc, date_d, date_f, email } = req.body;
    console.log(req.body)

    // Vérifier que les champs nécessaires sont présents
    if (!id || !nom || !desc || !date_d || !date_f || !email) {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    const query = 'INSERT INTO Evenement (Nom, Description, Date_Debut, Date_Fin, Mail_Client) VALUES (?, ?, ?, ?, ?)';
    connexion.query(query, [id, nom, desc, date_d, date_f, email], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de l\'evenement:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.status(201).send('Client ajouté avec succès');
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;  // Récupérer l'ID de l'evenement dans l'URL

    const query = 'DELETE FROM Evenement WHERE ID_Event = ?';
    connexion.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'evenement:', err);
            return res.status(500).send('Erreur serveur');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Evenement non trouvé');
        }
        res.send('Evenement supprimé avec succès');
    });
});

module.exports = router;  // Exporter les routes pour les utiliser dans le fichier principal
