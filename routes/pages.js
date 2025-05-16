const express = require('express');
const path = require('path');
const router = express.Router();

const pages = [
    { route: '/', file: 'index.html' },
    { route: '/event', file: 'event.html' },
    { route: '/admin', file: 'admin_principale.html' },
    { route: '/connexion', file: 'connexion.html' },
    { route: '/mes-event', file: 'mes_event.html' }
];

pages.forEach(({ route, file }) => {
    router.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, '../views', file)); // Ajuste le chemin en fonction de ta structure
    });
});

module.exports = router;
