const express = require('express');
const router = express.Router();
const connexion = require('./connexion');  // Connexion à la base de données
const bcrypt = require('bcrypt');  // Pour le hachage des mots de passe
const nodemailer = require("nodemailer");
require('dotenv').config();




function genererCode(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}


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

    const query = 'SELECT Type, Mdp, Nom, Prenom FROM Compte WHERE Mail = ?';
    connexion.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erreur lors de la requête', err);
            return res.status(500).send('Erreur serveur');
        }

        if (results.length === 0) {
            return res.status(401).send('Mot de passe incorrect');
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
                nom: user.Nom,
                prenom: user.Prenom,
                email,
                type: user.Type
            };
            
            if(req.session.evenement && user.Type != "admin")
            {
                return res.status(200).json({
                    success: true,
                    type: "evenenement_cache"
                  });
            }
            else
            {
                return res.status(200).json({
                    success: true,
                    type: user.Type
                  });
            }
              
            
        });
    });
});

router.post('/deconnexion', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Erreur lors de la déconnexion");
        }
        res.status(200).send("Yo top maigre")
    });
});



router.post('/creation', (req, res) => {
    const { code } = req.body

    if(code != req.session.code)
    {
        return res.status(400).send("Code incorrect")
    }

    const { email, nom, prenom, mdp, choixSituation } = req.session.logs;

    if (!email || !mdp || !nom || !prenom || !choixSituation || choixSituation.toLowerCase() == "admin") {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    const hashedPassword = bcrypt.hashSync(mdp, 10);

    const query = 'INSERT INTO Compte (Mail, Nom, Prenom, Mdp, Type) VALUES (?, ?, ?, ?, ?)';
    connexion.query(query, [email, nom, prenom, hashedPassword, choixSituation], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du compte:', err);
            return res.status(500).send('Compte déja existant');
        }
            req.session.user = {
                email,
                type: choixSituation,
                nom,
                prenom
            };

            if(req.session.evenement)
            {
                return res.status(200).json({
                    success: true,
                    type: "evenenement_cache"
                  });
            }
            else
            {
                return res.status(200).json({
                    success: true,
                    type: choixSituation
                  });
            }
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

router.get('/prenom_nom', (req, res) => {
    if(req.session.user.nom && req.session.user.prenom)
    {
        return res.status(200).json({prenom:req.session.user.prenom, nom:req.session.user.nom})
    }
    else
    {
        return res.status(400).send('Utilisateur inexistant');
    }
});

router.post('/envoie-verif-mail', (req, res) => {
    const { email, mdp, nom, prenom, choixSituation } = req.body
    if (!email || !mdp || !nom || !prenom || !choixSituation || choixSituation.toLowerCase() == "admin") {
        return res.status(400).send('Tous les champs sont nécessaires');
    }

    req.session.logs = req.body;
    req.session.code = genererCode(4)
    try{
        envoyerMailCode(req.session.code, email)
        res.status(200).send("Mail bien envoyé !")
    }
    catch(err)
    {
        res.status(400).send("Mail inexistant")
    }
    
});

async function envoyerMailCode(code, dest) {
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
        to: dest,
        subject: "Votre code : " + code,
        text: "Bonjour.\n" +
        "Veuillez créer votre compte grâce à ce code : " + code + " !\n" +
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



module.exports = router;  // Exporter les routes pour les utiliser dans le fichier principal
