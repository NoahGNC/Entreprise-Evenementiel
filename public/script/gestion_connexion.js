const loginForm = document.getElementById("formLogin")
const createForm = document.getElementById("formCreate")
const toggleBtn = document.getElementById("btnToggle")
let b = false;

// Fromulaires 

let mailConnexion = document.getElementById("mailConnexion")
let mdpConnexion = document.getElementById("mdpConnexion")
let bouttonConnexion = document.getElementById("bouttonConnexion")

let formConnexion = document.getElementById("formConnexion")

/*
formConnexion.addEventListener("submit", connexion)


function connexion(event)
{
    event.preventDefault()

    const form = formConnexion
    const formData = new FormData();
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
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des données :", error);
    });;

}
*/

window.onload = function () {
    loginForm.style.display = "block";
    createForm.style.display = "none";
};

function showLoginForm() {
    loginForm.style.display = "block";
    createForm.style.display = "none";
}

function showCreateForm() {
    loginForm.style.display = "none";
    createForm.style.display = "block";
}


function showForm() {
    if (b) {
        loginForm.style.display = "block";
        createForm.style.display = "none";
        toggleBtn.textContent = "Vous n'avez pas de compte ?"
    } else {
        loginForm.style.display = "none";
        createForm.style.display = "block";
        toggleBtn.textContent = "Vous avez déjà un compte ?";
    }

    b = !b;
}



window.showLoginForm = showLoginForm;
window.showCreateForm = showCreateForm;

