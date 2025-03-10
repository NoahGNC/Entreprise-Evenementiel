let popup = document.getElementById("popupActivites")
let popupParam = document.getElementById("popupParametresActivites")

let scroller = document.getElementById("scroller")

let ajouterBouton = document.getElementById("ajouter")
ajouterBouton.addEventListener("click", montrerChoix)


// Params

let titreParams = document.getElementById("titreParams")
let imageParams = document.getElementById("imageParams")
let descriptionParams = document.getElementById("descriptionParams")
let prixParams = document.getElementById("prixParams")

let quantiteParams = document.getElementById("quantiteParams")
quantiteParams.addEventListener("input", changerPrixUnite)

// Var

var prixUnite = 0

actualiseActivitesDispos()

function actualiseActivitesDispos()
{
    fetch('http://localhost:3006/api/composant')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        ajouteActivitesDispos(data);
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des données :", error);
    });
}

function ajouteActivitesDispos(data)
{
    data.forEach(element => {
        ajouteActivite(element)
    });
}

function ajouteActivite(element)
{
    let bouton = document.createElement("button")
    bouton.className = "activite"
    bouton.value = JSON.stringify(element)
    bouton.addEventListener("click", choixParametres)
    

    let image = document.createElement("img")
    image.src = element.Image
    image.className = "imageActivite"

    bouton.appendChild(image)

    scroller.appendChild(bouton)
}

function montrerChoix()
{
    cacherPopup(popupParam)
    afficherPopup(popup)
}

function choixParametres(event)
{
    let data = JSON.parse(event.currentTarget.value)
    titreParams.innerHTML = data.Nom
    imageParams.src = data.Image
    descriptionParams.innerHTML = data.Description
    prixUnite = data.Prix_Estime
    cacherPopup(popup)
    afficherPopup(popupParam)
}

function changerPrixUnite()
{
    quantiteParams.value
}

function afficherPopup(popup)
{
    popup.classList.add("montrer")
}

function cacherPopup(popup)
{
    popup.classList.remove("montrer")
}
