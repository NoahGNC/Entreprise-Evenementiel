const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Yo Test cool');
});

const PORT = 3006; // Remplace par ton numéro de groupe
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://51.68.91.213/info6/`);
});