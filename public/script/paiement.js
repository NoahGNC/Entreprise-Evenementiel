const numeroCarte = document.querySelector("#Numero_Carte");
const expirationCarte = document.querySelector("#Date_Expiration");

numeroCarte.addEventListener("input", function(e) {
    let valeur = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/g, "");
    e.target.value = valeur.replace(/(\d{4})/g, "$1 ").trim();
});

expirationCarte.addEventListener("input", function(e) {
    let valeur = e.target.value.replace(/\D/g, "");
    if (valeur.length > 2) {
        valeur = valeur.substring(0, 2) + "/" + valeur.substring(2, 4);
    }
    e.target.value = valeur;
});

let titre = document.getElementById("nomEvenement")
let prix = document.getElementById("prixTotal")
let paiement = document.getElementById("bouttonPaiement")
paiement.addEventListener("click", payer)
getInfos()

async function getInfos()
{
    try {
        const response = await fetch('./api/devis/paiement', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            titre.innerHTML = data.Nom
            prix.innerHTML = "Prix Total : " + data.Prix_Total + "€"
            paiement.value = JSON.stringify(data)
        } else {
            window.location.href = './connexion'
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }  
}

async function payer(e)
{
    try {
        const response = await fetch('./api/devis/payer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body : e.target.value
        });

        if (response.ok) {
            window.location.href = './mes-event'
        } else {
            console.log("Paiement refusé")
        }
    } catch (err) {
        console.log("Erreur Réseau")
    }  
}