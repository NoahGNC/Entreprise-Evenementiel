const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();
const connexion = require('./connexion');
require('dotenv').config();


router.post('/recherche-prestataires', (req, res) => {
    const { idEvent, dateEvent } = req.body;
    console.log("TEST : ", idEvent, dateEvent)
    const query = `
    SELECT 
        c.ID_Comp,
        c.Image, 
        c.Nom, 
        d.Quantite, 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'Mail_Prest', p.Mail_Prest, 
                'Prix_Total', p.Prix * d.Quantite
            )
        ) AS Prestataires
    FROM demande d
    JOIN Composant c ON d.ID_Comp = c.ID_Comp
    JOIN propose p ON p.ID_Comp = d.ID_Comp -- Ajout : Vérifier que le prestataire propose bien ce composant
    LEFT JOIN Inactif i ON i.Mail_Prest = p.Mail_Prest
    LEFT JOIN occupe o ON o.Mail_Prest = p.Mail_Prest AND o.ID_Comp = d.ID_Comp
    WHERE d.ID_Event = ?
    AND (i.Mail_Prest IS NULL OR ? NOT BETWEEN i.Date_Debut AND i.Date_Fin) -- Prestataire pas inactif à cette date
    AND (p.Quantite - COALESCE(o.Quantite, 0) >= d.Quantite) -- Vérifier le stock disponible
    GROUP BY c.ID_Comp, d.Quantite;
    `;

    connexion.query(query, [idEvent, dateEvent], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).send("Erreur serveur");
        }
        res.status(200).json(results);
    });
});

router.post('/details-evenement', (req, res) => {
    const { idEvent } = req.body;

    const query = `
        SELECT 
            c.Image, 
            c.Nom, 
            d.Quantite, 
            o.Mail_Prest, 
            (p.Prix * d.Quantite) AS Prix_Total
        FROM occupe o
        JOIN demande d ON o.ID_Event = d.ID_Event AND o.ID_Comp = d.ID_Comp
        JOIN Composant c ON d.ID_Comp = c.ID_Comp
        JOIN propose p ON p.ID_Comp = d.ID_Comp AND p.Mail_Prest = o.Mail_Prest
        WHERE o.ID_Event = ?;
    `;

    connexion.query(query, [idEvent], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).send("Erreur serveur");
        }
        console.log("Resultats : ", results)
        res.status(200).json(results);
    });
});


router.post('/occupe_prestation', (req, res) => {
    let { valeurs } = req.body;
    valeurs = valeurs.map(valeur => JSON.parse(valeur)); // Convertir JSON en objets

    const ID_Event = valeurs[0].ID_Event;

    const insertQuery = "INSERT INTO occupe (Mail_Prest, ID_Event, ID_Comp, Quantite) VALUES ?";

    connexion.query(insertQuery, [valeurs.map(obj => [obj.Mail_Prest, obj.ID_Event, obj.ID_Comp, obj.Quantite])], (err, result) => {
        if (err) {
            console.error("Erreur SQL (INSERT) :", err);
            return res.status(500).send("Erreur serveur");
        }

        const query = "UPDATE Evenement SET Etat = ? WHERE ID_Event = ?";
        
        connexion.query(query, [2, ID_Event], (err, result) => {
            if (err) {
                console.error("Erreur SQL (UPDATE) :", err);
                return res.status(500).send("Erreur serveur");
            }
            
            res.status(200).send("Demandes mises à jour");
        });
    });
});


module.exports = router;