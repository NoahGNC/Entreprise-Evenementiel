let conteneur = document.getElementById("conteneur")

let boutonDeconnexion = document.getElementById("deconnexion")
boutonDeconnexion.addEventListener("click", deconnexion)

let boutonNouveau = document.getElementById("newEvent")
boutonNouveau.addEventListener("click", nouvelEvenement)

let titre = document.getElementById("titre")

const etats = ["En cours de création", "En cours d'analyse", "En attente de paiement", "En préparation", "Terminé"]
const couleurs = ["grey", "yellow", "red", "green", "grey"]

var evenements

getEvenements()
set_prenom_nom()


function getEvenements()
{
    fetch('./api/evenement')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if(!data.type)
        {
            evenements = data
            ajouteEvenements()
        }
        else if(data.type == "pasco")
        {
            window.location.href = './connexion'
        }

    })
    .catch(error => {
        console.error("Erreur lors de la récupération des données :", error);
    });
}

function addComposants(div, eventID)
{
    fetch(`./api/demande/listeComp/${eventID}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        data.forEach(element => {
            let comp = document.createElement("div")
            let nom = document.createElement("h1")
            nom.innerHTML = element.Nom

            let img = document.createElement("img")
            img.src = element.Image
            img.alt = "Image de l'évènement"

            let quantite = document.createElement("h1")
            quantite.innerHTML = "Quantité : " + element.Quantite

            comp.className = "composant"

            comp.appendChild(img)
            comp.appendChild(nom)
            comp.appendChild(quantite)

            div.appendChild(comp)
        })
    })
}

function ajouteEvenements()
{
    evenements.forEach(element => {
        let section = document.createElement("section")

        let event = document.createElement("div")
        let nom = document.createElement("h2")
        nom.innerHTML = element.Nom

        let date = document.createElement("h1")
        let dateRaw = new Date(element.Date_Debut)
        const dateFormatted = dateRaw.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        date.innerHTML = dateFormatted

        let cont = document.createElement("div")
        cont.className = "box_etat"

        let pastille = document.createElement("div")
        pastille.className = "pastille"
        pastille.style.backgroundColor = couleurs[element.Etat]

        let etat = document.createElement("h1")
        etat.innerHTML = etats[element.Etat]

        cont.appendChild(pastille)
        cont.appendChild(etat)
      
        event.className = "event"

        event.appendChild(nom)
        event.appendChild(date)
        event.appendChild(cont)

        if(element.Etat == 0)
        {
            let modifier = document.createElement("button")
            modifier.innerHTML = "Accèder à mon évènement"
            modifier.addEventListener("click", modifierEvenement)
            modifier.id = "modifierBouton"
            modifier.value = element.ID_Event
            event.append(modifier)
        }
        else if(element.Etat == 2)
        {
            let payer = document.createElement("button")
            payer.innerHTML = "Payer mon Évènement"
            payer.addEventListener("click", modifierEvenement)
            payer.id = "payerBouton"
            payer.value = element.ID_Event
            event.append(payer)
        }
        
        
        let listeComp = document.createElement("div")
        addComposants(listeComp, element.ID_Event)
        listeComp.id = "listeComp"
        listeComp.className = "sidescroller"

        section.appendChild(event)
        section.appendChild(listeComp)

        conteneur.appendChild(section)
    });
}

async function deconnexion()
{
    try {
        const response = await fetch('./api/compte/deconnexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            window.location.href = './'
        } else {
        const message = await response.text();
        console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }
}


async function modifierEvenement(e)
{
        try {
        const response = await fetch('./api/evenement/id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({id:e.target.value})
        });

        if (response.ok) {
            const data = await response.json();
            if(data.action == "modifier")
            {
                window.location.href = './event'
            }
            else
            {
                window.location.href = './paiement'
            }
            
        } else {
        const message = await response.text();
        console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }
}

async function nouvelEvenement()
{
        try {
        const response = await fetch('./api/evenement/nouvel_evenement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            window.location.href = './event'
        } else {
            const message = await response.text();
            console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }  
}

async function set_prenom_nom()
{
        try {
        const response = await fetch('./api/compte/prenom_nom', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            titre.innerHTML = data.prenom + " " + data.nom
        } else {
            const message = await response.text();
            console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }  
}

