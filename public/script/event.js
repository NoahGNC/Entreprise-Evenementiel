let popup = document.getElementById("popupActivites")
let popupParam = document.getElementById("popupParametresActivites")
let popupNomDate = document.getElementById("popupNomDate")
let sauvegarderNomDate = document.getElementById("formNomDate")
let fermerPopupNomDateBouton = document.getElementById("fermerPopupNomDate")
fermerPopupNomDateBouton.addEventListener("click", fermerPopupNomDate)

sauvegarderNomDate.addEventListener("submit", insererEvenement)
let nomEvenement = document.getElementById("nomEvenement")
let dateEvenement = document.getElementById("dateEvenement")

let scroller = document.getElementById("scroller")

let ajouterBouton = document.getElementById("ajouter")
ajouterBouton.addEventListener("click", montrerChoix)

let panier = document.getElementById("panier")

let prixTotalTexte = document.getElementById("prixTotal")

let fermerPopup = document.getElementById("fermerPopup")
fermerPopup.addEventListener("click", fermerToutPopup)



let sauvegarderBouton = document.getElementById("sauvegarder")
sauvegarderBouton.addEventListener("click", sauvegarder)

let boutonMesEvent = document.getElementById("boutonMesEvent")
boutonMesEvent.addEventListener("click", erreurSauvegarde)

let erreurPopup = document.getElementById("popupErreur")
let messageErreur = document.getElementById("fermerErreur")
let fermerErreur = document.getElementById("fermerPopup")
fermerErreur.addEventListener("click", fermerErreurPopup)

let boutonDevis = document.getElementById("devis")
boutonDevis.addEventListener("click", montrerPopupDevis)

let popupDevis = document.getElementById("popupDevis")
let sauvegarderDevis = document.getElementById("formDevis")
sauvegarderDevis.addEventListener("submit", demanderDevis)

let nomDevis = document.getElementById("nomDevis")
let dateDevis = document.getElementById("dateDevis")

let fermerDevis= document.getElementById("fermerPopupDevis")
fermerDevis.addEventListener("click", fermerPopupDevis)


// Params

let titreParams = document.getElementById("titreParams")
let imageParams = document.getElementById("imageParams")
let descriptionParams = document.getElementById("descriptionParams")
let prixParams = document.getElementById("prixParams")
prixParams.innerHTML = "0 €"

let quantiteParams = document.getElementById("quantiteParams")
quantiteParams.addEventListener("input", changerPrixUnite)
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

var evenement

actualiseActivitesDispos()
verifieCache()

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

function montrerChoix()
{
    cacherPopup(popupParam)
    afficherPopup(popup)
}

function montrerPopupDevis()
{
    fermerToutPopup()
    afficherPopup(popupDevis)
}

function fermerPopupNomDate()
{
    cacherPopup(popupNomDate)
}

function fermerErreurPopup()
{
    fermerPopup(erreurPopup)
}

function fermerPopupDevis()
{
    fermerPopup(popupDevis)
}

function erreurSauvegarde()
{
    fermerToutPopup()
    afficherPopup(erreurPopup)
} 

function choixParametres(event)
{
    articleSelectionne = JSON.parse(event.currentTarget.value)
    if("Prix_Final" in articleSelectionne) // Alors c'est une modification
    {
        validerParams.style.display = "none"
        modifierParams.style.display = "inline"
        quantiteParams.value = articleSelectionne.Quantite
        changerPrixUnite()
    }
    else
    {
        validerParams.style.display = "inline"
        modifierParams.style.display = "none"  
        quantiteParams.value = 0
        prixParams.innerHTML = "0 €"      
    }
    titreParams.innerHTML = articleSelectionne.Nom
    imageParams.src = articleSelectionne.Image
    descriptionParams.innerHTML = articleSelectionne.Description


    cacherPopup(popup)
    afficherPopup(popupParam)
}

function validerParametres()
{
    if(quantiteParams.value > 0)
    {
        articleSelectionne["Quantite"] = parseInt(quantiteParams.value)
        articleSelectionne["Prix_Final"] = prixArticleQuantite(articleSelectionne)
        articles.push(articleSelectionne)
        actualiseArticles()
        cacherPopup(popupParam)
        calculPrixTotal()
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
        articles[index].Prix_Final = prixArticleQuantite(articles[index])
        
        actualiseArticles()
        cacherPopup(popupParam)
        calculPrixTotal()
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
    let price = prixArticleQuantite(art)

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

function calculPrixTotal()
{
    let prixTotal = 0
    for(let article of panier.children)
    {
        prixTotal += article.value
    }
    prixTotalTexte.innerHTML = "Prix total : " + prixTotal + " €"
}

function changerPrixUnite()
{
    prixParams.innerHTML = articleSelectionne.Prix_Estime * quantiteParams.value + " €"
}

function prixArticleQuantite(article)
{
    return article.Quantite * article.Prix_Estime
}

function fermerToutPopup()
{
    cacherPopup(popup)
    cacherPopup(popupParam)
    cacherPopup(popupNomDate)
    cacherPopup(erreurPopup)
    cacherPopup(popupDevis)
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
    calculPrixTotal()
}


async function verifieCache()
{
    try {
        const response = await fetch('./api/evenement/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articles)
        });

        if (response.ok) {
            
            const data = await response.json();
            console.log(data)
            if(data.success)
            {
                articles = data.evenement
                actualiseArticles()
                calculPrixTotal()

                if(data.evenement_stat) // Si l'élément existe déjà on peut ajouter le bouton devis
                {
                    console.log("Evenement Stat : ", data.evenement_stat)
                    evenement = data.evenement_stat
                    nomDevis.value = data.evenement_stat.Nom
                    dateDevis.value = new Date(data.evenement_stat.Date_Debut).toISOString().split("T")[0];
                    boutonDevis.style.display = "block"
                }
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
        const response = await fetch('./api/evenement/verifco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articles)
        });

        if (response.ok) {          
            const data = await response.json();
            console.log(data)
            if(data.success)
            {
                evenement_existant()
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

async function evenement_existant()
{
    try {
        const response = await fetch('./api/evenement/id_exist', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            
            const data = await response.json();
            console.log(data)
            if(data.success)
            {
                insererComposants(data.id)
            }
            else
            {
                fermerToutPopup()
                afficherPopup(popupNomDate)
            }

        } else {
            const message = await response.text();
            console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }
}

async function insererEvenement(e)
{
    e.preventDefault()
    try {
        const response = await fetch('./api/evenement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({nom:nomEvenement.value, date:dateEvenement.value})
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Valueur azttendue : " + data)
            insererComposants(data.id)
        } else {
            const message = await response.text();
            console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }
}

async function insererComposants(id_event)
{
    try {
        const response = await fetch('./api/evenement/compo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({compos:factorise_articles(), "id_event":id_event})
        });

        if (response.ok) {
            window.location.href = './mes-event'
        } else {
            const message = await response.text();
            console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }
}

async function demanderDevis(e)
{
    e.preventDefault()
    try {
        const response = await fetch('./api/evenement', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id:evenement.ID_Event, nom:nomDevis.value, date:dateDevis.value})
        });

        if (response.ok) {
            insererComposants(evenement.ID_Event)
        } else {
            const message = await response.text();
            console.log(message)
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }
}

function factorise_articles()
{
    return articles.map(({ ID_Comp, Quantite }) => ({ ID_Comp, Quantite }));
}