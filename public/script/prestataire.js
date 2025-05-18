import { startAgenda } from "./prestataireCalendrier.js"

let popup = document.getElementById("popupActivites")
let popupParam = document.getElementById("popupParametresActivites")

let scroller = document.getElementById("scroller")

let ajouterBouton = document.getElementById("ajouter")
ajouterBouton.addEventListener("click", montrerChoix)

let panier = document.getElementById("panier")

let fermerPopup = document.getElementById("fermerPopup")
fermerPopup.addEventListener("click", fermerToutPopup)

let sauvegarderBouton = document.getElementById("sauvegarder")
sauvegarderBouton.addEventListener("click", sauvegarder)

let erreurPopup = document.getElementById("popupErreur")
let fermerErreur = document.getElementById("fermerErreur")
fermerErreur.addEventListener("click", fermerErreurPopup)

let boutonDeconnexion = document.getElementById("deconnexion")
boutonDeconnexion.addEventListener("click", deconnexion)

let popupConges = document.getElementById("popupConges")

let congesBouton = document.getElementById("conges")
congesBouton.addEventListener("click", montrerConges)

let fermerConges = document.getElementById("fermerConges")
fermerConges.addEventListener("click", fermerToutPopup)

let formConges = document.getElementById("formConges")
formConges.addEventListener("submit", sauvegarderConges)

let popupErreurConges = document.getElementById("popupErreurConges")

let fermerErreurConges = document.getElementById("fermerErreurConges")
fermerErreurConges.addEventListener("click", fermerToutPopup)

let agenda = document.getElementById("agenda")
agenda.addEventListener("click", montrerAgenda)

let popupAgenda = document.getElementById("popupAgenda")

let fermerAgenda = document.getElementById("fermerAgenda")
fermerAgenda.addEventListener("click", fermerToutPopup)

let popupInfos = document.getElementById("popupInfos")

let fermerInfos = document.getElementById("fermerInfos")
fermerInfos.addEventListener("click", fermerToutPopup)

let contenuInfos = document.getElementById("contenuInfos")

// Params

let titreParams = document.getElementById("titreParams")
let imageParams = document.getElementById("imageParams")
let descriptionParams = document.getElementById("descriptionParams")
let prixParams = document.getElementById("prixParams")

let quantiteParams = document.getElementById("quantiteParams")
quantiteParams.value = 0

let validerParams = document.getElementById("validerParams")
validerParams.addEventListener("click", validerParametres)

let modifierParams = document.getElementById("modifierParams")
modifierParams.addEventListener("click", modifierParametres)

let annulerParams = document.getElementById("annulerParams")
annulerParams.addEventListener("click", fermerToutPopup)

// Var

var articleSelectionne

var articles = []
var propositions = []


actualiseActivitesDispos()
getPropose()
startAgenda()


function actualiseActivitesDispos()
{
    fetch('./api/composant')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        propositions = data;
        rempliActivitesDispos()
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des données :", error);
    });
}

function rempliActivitesDispos()
{
    scroller.innerHTML = ""
    propositions.forEach(element => {
        if(!articles.some(u => u.ID_Comp == element.ID_Comp))
        {
            ajouteActivite(element)    
        }
        
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

function montrerConges()
{
    fermerToutPopup()
    afficherPopup(popupConges)
}

function montrerAgenda()
{
    fermerToutPopup()
    afficherPopup(popupAgenda)
}

function montrerChoix()
{
    fermerToutPopup()
    afficherPopup(popup)
}

export async function montrerInfos(e)
{
    fermerToutPopup()
    afficherPopup(popupInfos)

        try {
        const response = await fetch('./api/prestataire/infos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: e.currentTarget.value
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            contenuInfos.innerHTML = ""
            let ul = document.createElement("ul")
            data.forEach(element => {
                construitListe(element, ul)
            });
            contenuInfos.appendChild(ul)
        } else {
        const message = await response.text();
        console.log(message)
        }
    } catch (err) {
        console.log(err)
    }
}

function construitListe(elem, ul)
{
    let li = document.createElement("li")
    
    let texte = document.createElement("p")
    texte.innerHTML = elem.Nom + " x" + elem.Quantite + " (" + elem.Prix_Final + "€)"
    texte.id = "texte-cool"

    let checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.id = "checkbox-cool"

    li.appendChild(texte)
    li.appendChild(checkbox)

    ul.appendChild(li)
}



function choixParametres(event)
{
    articleSelectionne = JSON.parse(event.currentTarget.value)
    if("Prix" in articleSelectionne) // Alors c'est une modification
    {
        validerParams.style.display = "none"
        modifierParams.style.display = "inline"
        quantiteParams.value = articleSelectionne.Quantite
        prixParams.value = articleSelectionne.Prix
    }
    else
    {
        validerParams.style.display = "inline"
        modifierParams.style.display = "none"  
        quantiteParams.value = 0 
        prixParams.value = articleSelectionne.Prix_Estime
    }
    titreParams.innerHTML = articleSelectionne.Nom
    imageParams.src = articleSelectionne.Image
    descriptionParams.innerHTML = articleSelectionne.Description


    cacherPopup(popup)
    afficherPopup(popupParam)
}

function validerParametres()
{
    if(quantiteParams.value > 0 && prixParams.value > 0)
    {
        articleSelectionne["Quantite"] = parseInt(quantiteParams.value)
        articleSelectionne["Prix"] = parseInt(prixParams.value)
        articles.push(articleSelectionne)
        actualiseArticles()
        cacherPopup(popupParam)
    }
    else
    {

    }
}

function modifierParametres()
{
    if(quantiteParams.value > 0)
    {
        let index = articles.findIndex(a => a.ID_Comp == articleSelectionne.ID_Comp)
        articles[index].Quantite = quantiteParams.value
        articles[index].Prix = prixParams.value
        
        actualiseArticles()
        cacherPopup(popupParam)
    }
    else
    {

    }
}

function actualiseArticles()
{
    console.log(articles)
    panier.innerHTML = ""
    articles.forEach(element => {
        ajouterArticle(element)
    });

    rempliActivitesDispos()
}

function ajouterArticle(art)
{
    let price = art["Prix"]

    let div = document.createElement("div")
    div.className = "article"
    div.value = price

    let titre = document.createElement("h1")
    titre.innerHTML = art.Nom
    titre.className = "titrePanier"

    let image = document.createElement("img")
    image.src = art.Image
    image.className = "imagePanier"

    let quantite = document.createElement("h2")
    quantite.innerHTML = "x" + art.Quantite
    quantite.className = "textePanier"

    let prix = document.createElement("h2")
    prix.innerHTML = price + " €"
    prix.className = "textePanier"

    let boutonModifier = document.createElement("button")
    boutonModifier.innerHTML = "Modifier"
    boutonModifier.value = JSON.stringify(art)
    boutonModifier.addEventListener("click", choixParametres)
    boutonModifier.className = "button"

    let boutonSuprimmer = document.createElement("button")
    boutonSuprimmer.innerHTML = "Suprimmer"
    boutonSuprimmer.value = art.ID_Comp
    boutonSuprimmer.addEventListener("click", suprimmer)
    boutonSuprimmer.className = "button" 

    div.append(titre)
    div.appendChild(image)
    div.append(quantite)
    div.append(prix)
    div.append(boutonModifier)
    div.append(boutonSuprimmer)
    panier.appendChild(div)
}

function fermerToutPopup()
{
    cacherPopup(popup)
    cacherPopup(popupParam)
    cacherPopup(erreurPopup)
    cacherPopup(popupConges)
    cacherPopup(popupErreurConges)
    cacherPopup(popupAgenda)
    cacherPopup(popupInfos)
}

function fermerErreurPopup()
{
    cacherPopup(erreurPopup)
}

function afficherPopup(popup)
{
    popup.classList.add("montrer")
}

function cacherPopup(popup)
{
    popup.classList.remove("montrer")
}

function suprimmer(e)
{
    articles = articles.filter(u => u.ID_Comp != e.target.value)
    actualiseArticles()
    rempliActivitesDispos()
}


async function getPropose()
{
    try {
        const response = await fetch('./api/prestataire', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            
            const data = await response.json();
            if(data.success)
            {
                articles = data.compos
                actualiseArticles()
            }
            else
            {
                window.location.href = './connexion'
            }

        } else {
            const message = await response.text();
            console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }
}


async function sauvegarder()
{
    try {
        const response = await fetch('./api/prestataire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({compos:articles})
        });

        if (response.ok) {          
            const data = await response.json();
            console.log(data)
            if(data.success)
            {
                console.log("Enregistrement Réussi !")
                fermerToutPopup()
                afficherPopup(erreurPopup)
            }
            else
            {
               console.log("Enregistrement Raté !")
            }

        } else {
            const message = await response.text();
            console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }
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

async function sauvegarderConges(e)
{
    e.preventDefault()
    const formData = new FormData(formConges);
    const data = Object.fromEntries(formData);

    console.log(data)
        try {
        const response = await fetch('./api/prestataire/inactivite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        });

        if (response.ok) {
            fermerToutPopup()
            afficherPopup(popupErreurConges)
        } else {
        const message = await response.text();
        console.log(message)
        }
    } catch (err) {
        console.log(err)
    }
}