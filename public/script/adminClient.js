let panelDroit = document.getElementById("panelDroit")
let conteneur = document.createElement("div")
conteneur.className = "conteneurDroit"

export function startClient() {
    panelDroit.innerHTML = ""
    panelDroit.appendChild(conteneur)
    actualiseClient()
}

function actualiseClient() {
    fetch("./api/compte/client")
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
                ajouterClient(element);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
        });
}

function ajouterClient(element) {

    let div = document.createElement("div");
    div.className = "client";

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