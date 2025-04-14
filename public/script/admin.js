import { startAgenda } from './adminCalendrier.js';
import { startActivite } from './adminActivites.js'

let activiteBouton = document.getElementById("activiteBouton")
let agendaBouton = document.getElementById("agendaBouton")

activiteBouton.addEventListener("click", startActivite)
agendaBouton.addEventListener("click", startAgenda)

