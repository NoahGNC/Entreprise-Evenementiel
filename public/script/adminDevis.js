let panelDroit = document.getElementById("panelDroit")
let conteneur = document.createElement("div")
conteneur.className = "conteneurDroit"

export function startDevis() {
    panelDroit.innerHTML = ""
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

    div.appendChild(mail);
    div.appendChild(nom);  

    conteneur.appendChild(div);

}