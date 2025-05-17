const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();
const connexion = require('./connexion');
require('dotenv').config();


router.post('/recherche-prestataires', (req, res) => {
    const { idEvent, dateEvent } = req.body;

    const query = `
    SELECT 
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
        JOIN propose p ON p.ID_Comp = d.ID_Comp
        LEFT JOIN Inactif i ON i.Mail_Prest = p.Mail_Prest
        LEFT JOIN occupe o ON o.Mail_Prest = p.Mail_Prest AND o.ID_Comp = d.ID_Comp
        WHERE d.ID_Event = ?
        AND (i.Mail_Prest IS NULL OR ? NOT BETWEEN i.Date_Debut AND i.Date_Fin) 
        AND (p.Quantite - COALESCE(d.Quantite, 0) >= d.Quantite)
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

module.exports = router;