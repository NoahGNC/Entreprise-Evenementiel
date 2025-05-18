const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();
const connexion = require('./connexion');
require('dotenv').config();


router.get('/', (req, res) => {

    if(!req.session.user || req.session.user.type != "prestataire")
    {
        res.status(200).json({success:false})
    }

    const query = "SELECT c.ID_Comp, c.Nom, c.Description, c.Image, c.Prix_Estime, p.Quantite, p.Prix\
        FROM propose p JOIN Composant c ON p.ID_Comp = c.ID_Comp WHERE p.Mail_Prest = ?;"

    connexion.query(query, [req.session.user.email], (err, result) => {
        if (err) {
            console.error("Erreur SQL (DELETE) :", err);
            return res.status(500).send("Erreur serveur");
        }

        res.status(200).json({success:true, compos:result})

    });
});

router.post('/', (req, res) => {
    const {compos} = req.body;

    const deleteQuery = "DELETE FROM propose WHERE Mail_Prest = ?";

    connexion.query(deleteQuery, [req.session.user.email], (err, result) => {
        if (err) {
            console.error("Erreur SQL (DELETE) :", err);
            return res.status(500).send("Erreur serveur");
        }

        if (!compos || compos.length === 0) {
            return res.status(200).send("Demandes supprimées (aucun nouvel ajout)");
        }

        const values = compos.map(({ ID_Comp, Prix, Quantite }) => [ID_Comp, req.session.user.email, Prix, Quantite]);
        const insertQuery = "INSERT INTO propose (ID_Comp, Mail_Prest, Prix, Quantite) VALUES ?";

        connexion.query(insertQuery, [values], (err, result) => {
            if (err) {
                console.error("Erreur SQL (INSERT) :", err);
                return res.status(500).send("Erreur serveur");
            }
            envoyerMail(req.session.user)
            res.status(200).json({success:true});
        });
    });
});

async function envoyerMail(user) {
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
        subject: "Merci de faire confiance à Evenmove !",
        text: "Bonjour " + user.prenom + " " + user.nom + ".\n" +
        "Vous venez de modifier les services que vous proposez en tant que prestataire.\nGuettez vos mails en vue d'évènements auxquelles vous participerez !"
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


router.post("/inactivite", (req, res) => {
    const { date1, date2 } = req.body;

    const query = `
        INSERT INTO Inactif (Mail_Prest, Date_Debut, Date_Fin) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            Date_Debut = VALUES(Date_Debut),
            Date_Fin = VALUES(Date_Fin);
    `;

    connexion.query(query, [req.session.user.email, date1, date2], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).send("Erreur serveur");
        }
        res.status(200).send("Période d'inactivité mise à jour !");
    });
});

router.post('/evenements-prestataire', (req, res) => {
    let dateLundi = new Date(req.body.date);
    console.log("Date : ", dateLundi)
    const mailPrest = req.session.user.email;

    const query = `
        SELECT DISTINCT
        (TO_DAYS(Date_Debut) - TO_DAYS(?)) AS index_jour, 
        e.ID_Event, e.Nom, e.Date_Debut, e.Mail_Client, e.Etat
        FROM Evenement e
        JOIN occupe o ON e.ID_Event = o.ID_Event
        WHERE o.Mail_Prest = ?
        AND Date_Debut BETWEEN ? AND DATE_ADD(?, INTERVAL 6 DAY)
        AND e.Etat > 0
        ORDER BY e.Date_Debut;

    `;

    connexion.query(query, [dateLundi, mailPrest, dateLundi, dateLundi], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).send("Erreur serveur");
        }


        const groupedResults = Array(7).fill().map(() => []);
        results.forEach(event => {
            let correctedIndex = event.index_jour;
            if (correctedIndex >= 0 && correctedIndex < 7) {
                groupedResults[correctedIndex].push(event);
            }
        });

        res.status(200).json(groupedResults);
    });
});


router.post('/infos', (req, res) => {
    const { ID_Event } = req.body;

    const query = `
        SELECT 
            c.Image AS Image,
            c.Nom AS Nom,
            o.Quantite AS Quantite,
            (o.Quantite * p.Prix) AS Prix_Final
        FROM occupe o
        JOIN propose p ON o.ID_Comp = p.ID_Comp AND o.Mail_Prest = p.Mail_Prest
        JOIN Composant c ON o.ID_Comp = c.ID_Comp
        WHERE o.ID_Event = ? AND o.Mail_Prest = ?;
    `;

    connexion.query(query, [ID_Event, req.session.user.email], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).send("Erreur serveur");
        }

        if (results.length === 0) {
            return res.status(404).send("Aucun composant trouvé pour ce prestataire et cet événement");
        }

        res.status(200).json(results);
    });
});


module.exports = router; 
