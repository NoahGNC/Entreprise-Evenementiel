let popup = document.getElementById("popupActivites")
let popupParam = document.getElementById("popupParametresActivites")

let scroller = document.getElementById("scroller")

let ajouterBouton = document.getElementById("ajouter")
ajouterBouton.addEventListener("click", montrerChoix)

let panier = document.getElementById("panier")

let prixTotalTexte = document.getElementById("prixTotal")

let fermerPopup = document.getElementById("fermerPopup")
fermerPopup.addEventListener("click", fermerToutPopup)


// Params

let titreParams = document.getElementById("titreParams")
let imageParams = document.getElementById("imageParams")
let descriptionParams = document.getElementById("descriptionParams")
let prixParams = document.getElementById("prixParams")

let quantiteParams = document.getElementById("quantiteParams")
quantiteParams.addEventListener("input", changerPrixUnite)

let validerParams = document.getElementById("validerParams")
validerParams.addEventListener("click", validerParametres)

let annulerParams = document.getElementById("annulerParams")
annulerParams.addEventListener("click", montrerChoix)

// Var

var articleSelectionne
var prixUnite = 0
var quantiteSelectionne = 0
var prixTotal = 0

actualiseActivitesDispos()

function actualiseActivitesDispos()
{
    fetch('/info6/api/composant')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
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
    articleSelectionne = JSON.parse(event.currentTarget.value)
    titreParams.innerHTML = articleSelectionne.Nom
    imageParams.src = articleSelectionne.Image
    descriptionParams.innerHTML = articleSelectionne.Description
    prixUnite = articleSelectionne.Prix_Estime
    cacherPopup(popup)
    afficherPopup(popupParam)
}

function validerParametres()
{
    if(quantiteSelectionne != 0)
    {
        ajouterArticle()
        cacherPopup(popupParam)
        calculPrixTotal()
    }
    else
    {

    }
}

function ajouterArticle()
{
    let div = document.createElement("div")
    div.className = "article"
    div.value = prixArticleQuantite() // Come ça on stock la valeur dans chaque div

    let titre = document.createElement("h1")
    titre.innerHTML = articleSelectionne.Nom
    titre.className = "titrePanier"

    let image = document.createElement("img")
    image.src = articleSelectionne.Image
    image.className = "imagePanier"

    let quantite = document.createElement("h2")
    quantite.innerHTML = "x" + quantiteSelectionne
    quantite.className = "textePanier"

    let prix = document.createElement("h2")
    prix.innerHTML = prixArticleQuantite() + " €"
    prix.className = "textePanier"

    div.append(titre)
    div.appendChild(image)
    div.append(quantite)
    div.append(prix)
    panier.appendChild(div)
}

function calculPrixTotal()
{
    prixTotal = 0
    for(let article of panier.children)
    {
        prixTotal += article.value
    }
    prixTotalTexte.innerHTML = "Prix total : " + prixTotal + " €"
}

function changerPrixUnite()
{
    quantiteSelectionne = quantiteParams.value
    prixParams.innerHTML = prixArticleQuantite() + " €"
}

function prixArticleQuantite()
{
    return quantiteSelectionne * prixUnite
}

function fermerToutPopup()
{
    cacherPopup(popup)
    cacherPopup(popupParam)
}

function afficherPopup(popup)
{
    popup.classList.add("montrer")
}

function cacherPopup(popup)
{
    popup.classList.remove("montrer")
}
