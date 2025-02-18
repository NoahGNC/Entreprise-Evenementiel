const express = require('express');
const router = express.Router();
const connexion = require("./connexion")

// Définir vos routes ici
router.get('/resource', (req, res) => {
    res.send('GET request received');
});

router.post('/resource', (req, res) => {
    res.send('POST request received');
});

router.put('/resource/:id', (req, res) => {
    res.send(`PUT request received for resource ${req.params.id}`);
});

router.delete('/resource/:id', (req, res) => {
    res.send(`DELETE request received for resource ${req.params.id}`);
});

module.exports = router;
