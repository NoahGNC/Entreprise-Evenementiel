import { getDevis } from './adminDevis.js';
// CONSTANTES

const semaine = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]



let panelDroit = document.getElementById("panelDroit")
let table
let decalage = 0


export function startAgenda()
{
    panelDroit.innerHTML = ""
    table = document.createElement("table")
    table.id = "calendrier"
    panelDroit.appendChild(table)
    remplirCalendrier()
}

function semainePrecedente()
{
    semaineDecal(-7)
}

function semaineSuivante()
{
    semaineDecal(7)
}

function semaineDecal(decal)
{
    decalage += decal
    table.innerHTML = ""
    remplirCalendrier()
}

async function remplirCalendrier()
{
    let bonJour = await getLundiDernier()
    remplirContenu(bonJour)
}

async function getLundiDernier()
{
    let res = await new Date()
    res.setDate((res.getDate() - (res.getDay() + 6) % 7) + decalage)
    return res;
}

function remplirEntete(bonJour)
{   
    
    let tr = document.createElement("tr")

    let precedent = document.createElement("button")
    precedent.className = "boutonCalendrier"
    precedent.innerHTML = "←"
    precedent.addEventListener("click", semainePrecedente)

    tr.appendChild(precedent)

    for(let i = 0; i < 7; i++){
        let td = document.createElement("td")
        td.innerHTML = semaine[i] + " " + bonJour.getDate() + " " + mois[bonJour.getMonth()] + " " + bonJour.getFullYear()
        td.className = "enteteCalendrier"
        tr.appendChild(td)

        bonJour.setDate(bonJour.getDate() + 1)
    };

    let suivant = document.createElement("button")
    suivant.className = "boutonCalendrier"
    suivant.innerHTML = "→"
    suivant.addEventListener("click", semaineSuivante)

    tr.appendChild(suivant)
    
    table.appendChild(tr)
}

async function remplirContenu(bonJour)
{
        let dataEx = await getEvenements(bonJour)
        remplirEntete(bonJour)
        console.log('data', dataEx)
        let tr = document.createElement("tr")
        tr.appendChild(document.createElement("div"))
        for(let i = 0; i < 7; i++)
        {
            let td = document.createElement("td")
            dataEx[i].forEach(element => {
                let div = document.createElement("button")
                div.value = JSON.stringify(element)
                div.addEventListener("click", getDevis)
                div.innerHTML = element.Nom
                div.className = "evenementCalendrier"
                td.appendChild(div)
            });
            
            td.className = "contenuCalendrier"
            tr.appendChild(td)
        }      
        table.appendChild(tr)
        
}

async function getEvenements(dateLundi)
{       
    console.log(dateLundi)
        try {
        const response = await fetch('./api/evenement/date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({date:dateLundi})
        });

        if (response.ok) {
            const data = await response.json();
            return data
        } else {
            const message = await response.text();
            console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }
}