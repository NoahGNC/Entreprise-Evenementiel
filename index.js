const express = require('express');
const path = require('path');

const app = express();
const PORT = 3006;

const routes = require(path.join(__dirname, 'routes', 'route.js'));
app.use('/api', routes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => 
{
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
}
);

app.get('/event', (req, res) =>
{
    res.sendFile(path.join(__dirname, 'views', 'event.html'));
}
);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://51.68.91.213/info6/`);
});