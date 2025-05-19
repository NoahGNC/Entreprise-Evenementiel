let panelDroit = document.getElementById("panelDroit")
let conteneur = document.createElement("div")
conteneur.className = "conteneurDroit"

var prestataireChoisis

const etats = ["Rien", "Urgent", "Paiement", "Préparation", "Terminé"]
const etatsCouleurs = ["rien", "crimson", "darkorange", "darkolivegreen", "black"]

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
        console.log(err)
    }
}

function ajouterDevis(element) {

    let div = document.createElement("div");
    div.className = "devis";
    div.style.backgroundColor = etatsCouleurs[element.Etat]

    let mail = document.createElement("h1");
    mail.innerHTML = element.Mail_Client;

    let nom = document.createElement("h2");
    nom.innerHTML = element.Nom;

    let etat = document.createElement("h2")
    etat.innerHTML = "<b>" + etats[element.Etat] + "</b>"

    let boutonModifier = document.createElement("button")
    boutonModifier.id = "boutonModifier"
    boutonModifier.innerHTML = "Accèder au devis"
    boutonModifier.value = JSON.stringify(element)
    boutonModifier.addEventListener("click", getDevis)

    div.appendChild(mail);
    div.appendChild(nom);  
    div.appendChild(etat)
    div.appendChild(boutonModifier)

    conteneur.appendChild(div);
}

export async function getDevis(e)
{
    panelDroit.innerHTML = ""
    conteneur.innerHTML = ""
    prestataireChoisis = []
    let valeurs
    if(e.currentTarget)
    {
        valeurs = JSON.parse(e.currentTarget.value)
    }
    else
    {
        valeurs = JSON.parse(e)
    }
    try {
        let response
        if(valeurs.Etat == 1)
        {
            response = await fetch('./api/devis/recherche-prestataires', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({idEvent:valeurs.ID_Event, dateEvent:valeurs.Date_Debut})
            });
        }
        else
        {
            response = await fetch('./api/devis/details-evenement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({idEvent:valeurs.ID_Event})
            });
        }


        if (response.ok) {
            const data = await response.json();
            construitInfosDevis(data, valeurs)
        } else {
            const message = await response.text();
            console.log(message)
        }
        } catch (err) {
            console.log(err)
        }
    }

function construitInfosDevis(data, valeurs)
{   
    let titre = document.createElement("h2")
    titre.innerHTML = valeurs.Nom
    titre.id = "titreDevis"

    let date = document.createElement("h2")
    let dateRaw = new Date(valeurs.Date_Debut)
    const dateFormatted = dateRaw.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    date.innerHTML = dateFormatted
    date.id = "dateDevis"
    
    let table = document.createElement("table")
    construitEntete(table)
    data.forEach(element => {
        developpeDevis(element, table, valeurs)
    });

    panelDroit.appendChild(titre)
    panelDroit.appendChild(date)
    panelDroit.appendChild(table)

    console.log("Data : ", data)
    
    switch(valeurs.Etat)
    {
        case 1 :
            let boutonValider = document.createElement("button")
            boutonValider.innerHTML = "Valider Prestataires"
            boutonValider.id = "boutonValider"
            valeurs.Etat = 2
            boutonValider.value = JSON.stringify(valeurs)
            boutonValider.addEventListener("click", confirmerPrestataires)
            panelDroit.appendChild(boutonValider) // A faire demain : Le bouton valider envoie un mail au client pour lui dire de payer, le presta reçoie un mail de participation.
            break
        case 2 :
            let paiementAttente = document.createElement("h2")
            paiementAttente.innerHTML = "Paiement en attente"
            paiementAttente.id = "paiementAttente"
            panelDroit.appendChild(paiementAttente)
            break
    }
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

function developpeDevis(devis, table, valeurs)
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

    if(valeurs.Etat == 1)
    {
        let selectPrestataire = document.createElement("select")

        devis.Prestataires = JSON.parse(devis.Prestataires)

        devis.Prestataires.forEach(prest => {
            let option = document.createElement("option")
            option.value = JSON.stringify({Mail_Prest:prest.Mail_Prest, ID_Event:valeurs.ID_Event, ID_Comp:devis.ID_Comp, Quantite:devis.Quantite})
            option.innerHTML = prest.Mail_Prest + " (" + prest.Prix_Total + "€)"
            selectPrestataire.appendChild(option)
        });
       
        prestataireChoisis.push(selectPrestataire)
        prestataire.appendChild(selectPrestataire)
    }
    else
    {
        prestataire.innerHTML = devis.Mail_Prest + " (" + devis.Prix_Total + "€)"
    }

    

   

    tr.appendChild(icone)
    tr.appendChild(nom)
    tr.appendChild(quantite)
    tr.appendChild(prestataire)
    table.appendChild(tr)
}

async function confirmerPrestataires(e)
{
    const valeursSelectionnees = Array.from(prestataireChoisis).map(select => select.value);
    try {
    const response = await fetch('./api/devis/occupe_prestation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({valeurs:valeursSelectionnees, event:e.currentTarget.value})
    });

    if (response.ok) {
        console.log("Prestataires enregistrés !")
        console.log(e.target.value)
        getDevis(e.target.value)
    } else {
        const message = await response.text();
        console.log(message)
    }
    } catch (err) {
        console.log(err)
    }
}