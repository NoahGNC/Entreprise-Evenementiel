const express = require('express');
const path = require('path');
const router = express.Router();

const pages = [
    { route: '/', file: 'index.html' },
    { route: '/event', file: 'event.html' },
    { route: '/connexion', file: 'connexion.html' },
    { route: '/mes-event', file: 'mes_event.html' }
];

pages.forEach(({ route, file }) => {
    router.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, '../views', file));
    });
});

// Je l'a met à part pour des questions de sécurité
router.get('/admin', (req, res) => {
    if(req.session.user.type == "admin")
    {
        res.sendFile(path.join(__dirname, '../views', ""));
    }
    else
    {
        res.status(403)
    }
});


module.exports = router;
