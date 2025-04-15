let panelDroit = document.getElementById("panelDroit")
let conteneur = document.createElement("div")
conteneur.className = "conteneurDroit"

export function startPrestataire() {
    panelDroit.innerHTML = ""
    panelDroit.appendChild(conteneur)
    actualisePrestataire()
}

function actualisePrestataire() {
    fetch("./api/compte/prestataire")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            conteneur.innerHTML = ""
            data.forEach(element => {
                ajouterPrestataire(element);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
        });
}

function ajouterPrestataire(element) {

    let div = document.createElement("div");
    div.className = "prestataire";

    let mail = document.createElement("h1");
    mail.innerHTML = element.Mail;

    let nom = document.createElement("h2");
    nom.innerHTML = element.Nom;

    let prenom = document.createElement("h2");
    prenom.innerHTML = element.Prenom;

    div.appendChild(mail);
    div.appendChild(nom);  
    div.appendChild(prenom);

    conteneur.appendChild(div);

}