const express = require('express');
const path = require('path');
const router = express.Router();

const pages = [
    { route: '/', file: 'index.html' },
    { route: '/event', file: 'event.html' },
    { route: '/connexion', file: 'connexion.html' },
    { route: '/mes-event', file: 'mes_event.html' },
    { route: '/prestataire', file: 'prestataire.html' },
    { route: '/paiement', file: 'paiement.html' },
    { route: '/verifmail', file: 'verifmail.html'}
];

pages.forEach(({ route, file }) => {
    router.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, '../views', file));
    });
});

// Je l'a met à part pour des questions de sécurité
router.get('/admin', (req, res) => {
    if(req.session.user && req.session.user.type == "admin")
    {
        res.sendFile(path.join(__dirname, '../views', "admin_principale.html"));
    }
    else
    {
        res.status(403).send("Erreur 403 - Tu fais quoi ici sale loser ?")
    }
});


module.exports = router;
