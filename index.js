const express = require('express');
const path = require('path');

const app = express();
const PORT = 3006;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => 
{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}
);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://51.68.91.213/info6/`);
});