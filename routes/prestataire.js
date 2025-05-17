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


module.exports = router; 
