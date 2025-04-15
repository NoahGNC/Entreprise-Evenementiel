
let panelDroit = document.getElementById("panelDroit")
let conteneur = document.createElement("div")
conteneur.className = "conteneurDroit"


let popup = document.getElementById("activiteFormCadre")
let form = document.getElementById("activiteForm")
form.addEventListener("submit", insererActivite)


let boutonAnnulerActivite = document.getElementById("annulerActivite")
boutonAnnulerActivite.addEventListener("click", cacherPopup)

let creerActiviteBouton = document.createElement("button")
creerActiviteBouton.innerHTML = "Ajouter un nouveau type d'activité"
creerActiviteBouton.id = "ajouterActiviteBouton";
creerActiviteBouton.addEventListener("click", afficherPopup)

export function startActivite()
{
    panelDroit.innerHTML = ""
    panelDroit.appendChild(conteneur)
    actualiseActivite()
}

function insererActivite(event)
{
    event.preventDefault()

    const formData = new FormData(form);
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var json = JSON.stringify(object);

    fetch(form.action, {
        method: form.method,
        headers: {
            'Content-Type': 'application/json',  // Indique que les données sont en JSON
        },
        body: json
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        return response;
    })
    .then(data => {
        console.log(data);
        cacherPopup()
        actualiseActivite()
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des données :", error);
    });;
}

function actualiseActivite()
{
    
    fetch('./api/composant')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        ajouterActivitesPartie(data);
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des données :", error);
    });
}

function ajouterActivitesPartie(data) {
    conteneur.innerHTML = '';

    data.forEach(element => {
        ajouterActivite(element);  
    });


    let creerActiviteBouton = document.createElement("button");
    creerActiviteBouton.innerHTML = "Ajouter un nouveau type d'activité";
    creerActiviteBouton.id = "ajouterActiviteBouton"; 
    creerActiviteBouton.addEventListener("click", afficherPopup);


    conteneur.appendChild(creerActiviteBouton);
}


function ajouterActivite(element){
    let div = document.createElement("div")
        div.className = "activite"

        let titre = document.createElement("h1")
        titre.innerHTML = element.Nom

        let image = document.createElement("img")
        image.className = "iconeActivite"
        image.src = element.Image

        let description = document.createElement("h2")
        description.innerHTML = element.Description

        let prix = document.createElement("h2")
        prix.innerHTML = "Prix : " + element.Prix_Estime + "€"

        let modifier = document.createElement("button")
        modifier.innerHTML = "Modifier évènement"
        modifier.className = "insideBouton"

        let suprimmer = document.createElement("button")
        suprimmer.innerHTML = "Supprimmer évènement"
        suprimmer.value = element.ID_Comp
        suprimmer.addEventListener("click", suprimmer_activite)
        suprimmer.className = "insideBouton"
        

        div.appendChild(titre)
        div.appendChild(image)
        div.appendChild(description)
        div.appendChild(prix)
        div.appendChild(modifier)
        div.appendChild(suprimmer)

        conteneur.appendChild(div)
}

function suprimmer_activite(event) {
    let id = event.target.value;

    fetch(`./api/composant/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        return response;
    })
    .then(data => {
        actualiseActivite()
        console.log("Suppression réussie :", data);
    })
    .catch(error => {
        console.error("Erreur lors de la suppression :", error);
    });
}

function afficherPopup()
{
    popup.style.display = "block"
}

function cacherPopup()
{
    popup.style.display = "none"
}

