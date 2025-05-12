const express = require('express');
const router = express.Router();
const connexion = require('./connexion');


router.get('/all', (req, res) => {
    const query = 'SELECT ID_Event, Nom, Date_Debut, Mail_Client, Etat FROM Evenement';
    connexion.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des evenements:', err);
            return res.status(500).send('Erreur serveur');
        }
        res.json(results);
    });
});

router.get('/', (req, res) => {

    if(!req.session.user)
    {
        res.json({success:true, type:"pasco"}) 
    }
    else
    {
        console.log("Email : " + req.session.user["email"])
        const query = 'SELECT ID_Event, Nom, Date_Debut, Etat FROM Evenement WHERE Mail_Client = ?';
        connexion.query(query, [req.session.user.email], (err, results) => {
            if (err) {
                console.error('Erreur lors de la récupération des evenements:', err);
                return res.status(500).send('Erreur serveur');
            }
            res.json(results);
        });
    }
});

// Là on récupère tout les élements qui compose l'evenement
router.get('/id', (req, res) => {
        
        const query = 'SELECT ID_Event, Nom, Date_Debut, Etat FROM Evenement WHERE Mail_Client = ?';
        connexion.query(query, [req.session.user.email], (err, results) => {
            if (err) {
                console.error('Erreur lors de la récupération des evenements:', err);
                return res.status(500).send('Erreur serveur');
            }
            res.json(results);
        });
});

router.post('/', (req, res) => {
    const {nom, date} = req.body;
    console.log(req.body)
    const query = "INSERT INTO `Evenement` (`ID_Event`, `Nom`, `Date_Debut`, `Mail_Client`, `Etat`) VALUES (NULL, ?, ?, ?, '0')";
    connexion.query(query, [nom, date, req.session.user.email], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des evenements:', err);
            return res.status(500).send('Erreur serveur');
        }
        connexion.query("SELECT LAST_INSERT_ID()", (err, results) => {
            if (err) {
            console.error('Erreur lors de la récupération des evenements:', err);
            return res.status(500).send('Erreur serveur');
            }
            console.log("Dernier identifiant : ", results)
            const lastId = results[0]['LAST_INSERT_ID()']; // Récupération correcte
            res.status(200).json({ success: true, id: lastId });
        });
        
    });
});

router.post('/compo', (req, res) => {
    const { compos, id_event } = req.body;

    if (!id_event) {
        return res.status(400).send("ID_Event manquant");
    }

    const deleteQuery = "DELETE FROM demande WHERE ID_Event = ?";

    connexion.query(deleteQuery, [id_event], (err, result) => {
        if (err) {
            console.error("Erreur SQL (DELETE) :", err);
            return res.status(500).send("Erreur serveur");
        }

        if (!compos || compos.length === 0) {
            return res.status(200).send("Demandes supprimées (aucun nouvel ajout)");
        }

        const values = compos.map(({ ID_Comp, Quantite }) => [ID_Comp, id_event, Quantite]);
        const insertQuery = "INSERT INTO demande (ID_Comp, ID_Event, Quantite) VALUES ?";

        connexion.query(insertQuery, [values], (err, result) => {
            if (err) {
                console.error("Erreur SQL (INSERT) :", err);
                return res.status(500).send("Erreur serveur");
            }
            res.status(200).send("Demandes mises à jour");
        });
    });
});


router.post('/verifco', (req, res) => {
        console.log(req.body)
        req.session.evenement = req.body
        return res.status(201).json({
            success: req.session.user != null,
          });
});

// Pour si l'utilisateur à soit fait un event sans se connecter, soit quand il selectionne un evenement tout simplement.
router.post('/cache', (req, res) => {
    // Si on a choisit
    if(req.session.id_evenement)
    {
        const query = "SELECT c.ID_Comp, c.Nom, c.Description, c.Image, c.Prix_Estime, d.Quantite, (d.Quantite * c.Prix_Estime) AS Prix_Final\
        FROM demande d JOIN Composant c ON d.ID_Comp = c.ID_Comp WHERE d.ID_Event = ?;"

        connexion.query(query, [req.session.id_evenement], (err, result) => {
            if (err) {
                console.error("Erreur SQL (INSERT) :", err);
                return res.status(500).send("Erreur serveur");
            }
            console.log("Evenement choisi : " + result)
            res.status(200).json({success:true, evenement:result});
        });
    }
    else if(!req.session.evenement)
    {
        console.log(req.session.evenement)
        return res.status(201).json({
            success: false,
          });
    }
    else // Cas du cash du nouvelle utilisateur
    {
        console.log(req.session.evenement)
        return res.status(201).json({success: true, evenement: req.session.evenement});
    }
});

// Pour récupérer l'id de l'evenement sur lequelle on travaille
router.get('/id_exist', (req, res) => {

    if(!req.session.id_evenement)
    {
        console.log(req.session.id_evenement)
        return res.status(201).json({
            success: false,
          });
    }
    else
    {
        console.log(req.session.id_evenement)
        return res.status(201).json({success: true, id: req.session.id_evenement});
    }
});

// Pour choisir quel évènement modifier.
router.post('/id', (req, res) => {
    const { id } = req.body;
    const mail_client = req.session.user.email;
    console.log("Test: " + id, mail_client)
    const query = "SELECT COUNT(*) AS existe FROM Evenement WHERE ID_Event = ? AND Mail_Client = ?";

    connexion.query(query, [id, mail_client], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).send("Erreur serveur");
        }

        if (results[0].existe > 0) {
            req.session.id_evenement = id;
            res.status(200).send("ID d'événement défini avec succès");
        } else {
            res.status(403).send("Vous n'avez pas accès à cet événement");
        }
    });
});

router.post('/nouvel_evenement', (req, res) => {
    req.session.id_evenement = null
    req.session.evenement = null
    res.status(200).send("Nouvel évènement possible")
});



module.exports = router; 
