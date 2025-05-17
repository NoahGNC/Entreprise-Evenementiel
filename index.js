const express = require('express');
const session = require('express-session')
const path = require('path');

const app = express();
const PORT = 3006;

app.use(session({
    secret: 'Yomancool',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));


app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const routes = require(path.join(__dirname, 'routes', 'route.js'));
app.use('/api', routes);

app.use(express.static(path.join(__dirname, 'public')));

const pageRoutes = require('./routes/pages');
app.use(pageRoutes);


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://51.68.91.213/info6/`);
});