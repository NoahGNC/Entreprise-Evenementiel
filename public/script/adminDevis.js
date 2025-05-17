let panelDroit = document.getElementById("panelDroit")
let conteneur = document.createElement("div")
conteneur.className = "conteneurDroit"

export function startDevis() {
    panelDroit.innerHTML = ""
    conteneur.innerHTML = ""
    panelDroit.appendChild(conteneur)
    actualiseDevis()
}

async function actualiseDevis() {
    try {
        const response = await fetch('./api/evenement/devis_actifs', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            data.forEach(element => {
                ajouterDevis(element)
            });
        } else {
            const message = await response.text();
            console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }
}

function ajouterDevis(element) {

    let div = document.createElement("div");
    div.className = "devis";

    let mail = document.createElement("h1");
    mail.innerHTML = element.Mail_Client;

    let nom = document.createElement("h2");
    nom.innerHTML = element.Nom;

    let boutonModifier = document.createElement("button")
    boutonModifier.id = "boutonModifier"
    boutonModifier.innerHTML = "Modifier"
    boutonModifier.value = JSON.stringify(element)
    boutonModifier.addEventListener("click", getDevis)

    div.appendChild(mail);
    div.appendChild(nom);  
    div.appendChild(boutonModifier)

    conteneur.appendChild(div);
}

export async function getDevis(e)
{
    panelDroit.innerHTML = ""
    conteneur.innerHTML = ""
    let valeurs = JSON.parse(e.target.value) 
    try {
    const response = await fetch('./api/devis/recherche-prestataires', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({idEvent:valeurs.ID_Event, dateEvent:valeurs.Date_Debut})
    });

    if (response.ok) {
        const data = await response.json();
        construitTableauDevis(data, valeurs)
    } else {
        const message = await response.text();
        console.log(message)
    }
    } catch (err) {
        console.log(err)
    }
}

function construitTableauDevis(data, valeurs)
{   
    let titre = document.createElement("h2")
    titre.innerHTML = valeurs.Nom
    titre.id = "titreDevis"

    let date = document.createElement("h2")
    date.innerHTML = valeurs.Date_Debut
    date.id = "dateDevis"
    
    let table = document.createElement("table")
    construitEntete(table)
    data.forEach(element => {
        developpeDevis(element, table)
    });
    

    let boutonValider = document.createElement("button")
    boutonValider.innerHTML = "Valider Prestataires"
    boutonValider.id = "boutonValider"

    panelDroit.appendChild(titre)
    panelDroit.appendChild(date)
    panelDroit.appendChild(table)
    panelDroit.appendChild(boutonValider) // A faire demain : Le bouton valider envoie un mail au client pour lui dire de payer, le presta reçoie un mail de participation.
}

function construitEntete(table)
{
    let tr = document.createElement("tr")
    tr.className = "tr-devis-entete"

    let icone = document.createElement("td")
    icone.innerHTML = "Icone"
    icone.className = "td-devis-entete"

    let nom = document.createElement("td")
    nom.innerHTML = "Nom"
    nom.className = "td-devis-entete"

    let quantite = document.createElement("td")
    quantite.innerHTML = "Quantité"
    quantite.className = "td-devis-entete"

    let prestataire = document.createElement("td")
    prestataire.innerHTML = "Prestataire"
    prestataire.className = "td-devis-entete"

    tr.appendChild(icone)
    tr.appendChild(nom)
    tr.appendChild(quantite)
    tr.appendChild(prestataire)
    table.appendChild(tr)


}

function developpeDevis(devis, table)
{
    let tr = document.createElement("tr")
    tr.className = "tr-devis"

    let icone = document.createElement("td")
    icone.className = "td-devis"

    let image = document.createElement("img")
    image.className = "iconeDevis"
    image.src = devis.Image

    icone.appendChild(image)

    let nom = document.createElement("td")
    nom.innerHTML = devis.Nom
    nom.className = "td-devis"

    let quantite = document.createElement("td")
    quantite.innerHTML = devis.Quantite
    quantite.className = "td-devis"

    let prestataire = document.createElement("td")
    prestataire.className = "td-devis"

    let selectPrestataire = document.createElement("select")

    devis.Prestataires = JSON.parse(devis.Prestataires)

    devis.Prestataires.forEach(prest => {
        let option = document.createElement("option")
        option.innerHTML = prest.Mail_Prest + " " + prest.Prix_Total + "€"
        selectPrestataire.appendChild(option)
    });

    prestataire.appendChild(selectPrestataire)

    tr.appendChild(icone)
    tr.appendChild(nom)
    tr.appendChild(quantite)
    tr.appendChild(prestataire)
    table.appendChild(tr)
}