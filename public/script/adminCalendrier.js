import { getDevis } from './adminDevis.js';
// CONSTANTES

const semaine = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

const etats = ["Rien", "Urgent", "Paiement", "Préparation", "Terminé"]
const etatsCouleurs = ["rien", "crimson", "darkorange", "darkolivegreen", "black"]

let panelDroit = document.getElementById("panelDroit")
let table
let decalage = 0


export function startAgenda()
{
    panelDroit.innerHTML = ""
    table = document.createElement("table")
    table.id = "calendrier"
    table.className = "calendrier"
    table.classList.add('visible');
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
    table.classList.remove('visible')
    remplirCalendrier()
}

async function remplirCalendrier()
{
    let bonJour = await getLundiDernier()
    await remplirContenu(bonJour)
    table.classList.add("visible")
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
        let tr = document.createElement("tr")
        tr.appendChild(document.createElement("div"))
        for(let i = 0; i < 7; i++)
        {
            let td = document.createElement("td")
            dataEx[i].forEach(element => {
                let div = document.createElement("button")
                div.className = "caseCalendier"
                div.value = JSON.stringify(element)
                console.log("element :", div.value)
                div.addEventListener("click", getDevis)
                div.style.backgroundColor = etatsCouleurs[element.Etat]

                let nom = document.createElement("p")
                nom.innerHTML = element.Nom

                let etat = document.createElement("p")
                etat.innerHTML = "<b>" + etats[element.Etat] + "</b>"

                div.appendChild(nom)
                div.appendChild(etat)

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