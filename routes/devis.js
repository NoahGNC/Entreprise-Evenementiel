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
           // envoyerMailPaiement(req.session.user)
            res.status(200).send("Demandes mises à jour");
        });
    });
});


router.get("/paiement", (req, res) => {

    if(!req.session.user)
    {
        return res.status(403).send("Événement non trouvé");
    }

    const idEvent = req.session.id_evenement;

    const query = `
        SELECT 
            e.Nom, 
            e.Date_Debut,
            e.ID_Event,
            SUM(d.Quantite * p.Prix) AS Prix_Total
        FROM Evenement e
        JOIN demande d ON e.ID_Event = d.ID_Event
        JOIN propose p ON p.ID_Comp = d.ID_Comp AND p.Mail_Prest IN (
            SELECT o.Mail_Prest FROM occupe o WHERE o.ID_Event = e.ID_Event AND o.ID_Comp = d.ID_Comp
        )
        WHERE e.ID_Event = ?
        GROUP BY e.ID_Event;
    `;

    connexion.query(query, [idEvent], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).send("Erreur serveur");
        }

        if (results.length === 0) {
            return res.status(404).send("Événement non trouvé");
        }

        res.status(200).json(results[0]);
    });
});


router.put("/payer", (req, res) => {
    const { ID_Event } = req.body;

    const query = "UPDATE Evenement SET Etat = 3 WHERE ID_Event = ?";

    connexion.query(query, [ID_Event], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).send("Erreur serveur");
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("Événement non trouvé");
        }

        envoyerMailPaiementReussi(req.session.user, req.body)
        res.status(200).send("État mis à jour avec succès !");
    });
});






async function envoyerMailPaiement(user) {
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Il ne vous reste plus qu'a payer !",
        text: "Bonjour " + user.prenom + " " + user.nom + ".\n" +
        "Rendez vous sur http://51.68.91.213/info6/mes-event pour réaliser le paiement."
    };

    try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé:", info.response); // Vérification
    return true

    } catch (error) {
        console.error("Erreur d'envoi:", error);
        throw error
    }
}

async function envoyerMailPaiementReussi(user, event) {
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });

        event.Date_Debut = new Date(event.Date_Debut).toLocaleDateString('fr-FR', {day: 'numeric',month: 'long',year: 'numeric'});

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Merci de faire confiance à EvenMove",
        text: "Bonjour " + user.prenom + " " + user.nom + ".\n" +
        "Vous avez réglé le montant du prix total de votre évènement.\n" +
        "Rendez vous le " + event.Date_Debut + " pour votre superbe Évènement '" + event.Nom + "' !\n" +
        "Cordialement." 
    };

    try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé:", info.response); // Vérification
    return true

    } catch (error) {
        console.error("Erreur d'envoi:", error);
        throw error
    }
}



module.exports = router;