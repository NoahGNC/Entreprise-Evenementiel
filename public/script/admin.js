import { startAgenda } from './adminCalendrier.js';
import { startActivite } from './adminActivites.js'
import { startPrestataire } from './adminPrestataire.js';
import { startClient } from './adminClient.js';
import { startDevis } from './adminDevis.js';

let activiteBouton = document.getElementById("activiteBouton")
let agendaBouton = document.getElementById("agendaBouton")
let prestataireBouton = document.getElementById("prestataireBouton")
let clientBouton = document.getElementById("clientBouton")
let devisBouton = document.getElementById("devisBouton")

activiteBouton.addEventListener("click", startActivite)
agendaBouton.addEventListener("click", startAgenda)
prestataireBouton.addEventListener("click", startPrestataire)
clientBouton.addEventListener("click", startClient)
devisBouton.addEventListener("click", startDevis)

try {
    const response = await fetch('./api/compte/est_admin', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {          
        startAgenda()
    } else {
        window.location.href = './'
    }
} catch (err) {
    console.log("Erreur Réseau")
}