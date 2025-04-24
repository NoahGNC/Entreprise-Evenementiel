const loginForm = document.getElementById("formLogin")
const createForm = document.getElementById("formCreate")
const toggleBtn = document.getElementById("btnToggle")
let b = false;

// Fromulaires 

let messageErreur = document.getElementById('erreur')

let mailConnexion = document.getElementById("mailConnexion")
let mdpConnexion = document.getElementById("mdpConnexion")
let bouttonConnexion = document.getElementById("bouttonConnexion")

let formConnexion = document.getElementById("formConnexion")

let formCreation = document.getElementById("formCreation")


formConnexion.addEventListener("submit", connexion)
formCreation.addEventListener("submit", creation)


async function connexion(e)
{
    envoie_api(e, "connexion")
}

async function creation(e)
{
    envoie_api(e, "creation")
}

async function envoie_api(e, suffixe)
{
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/compte/' + suffixe, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        });

        if (response.ok) {
            
            const data = await response.json();
            console.log(data)
            if(data.success)
            {
                switch(data.type)
                {
                    case "client" :
                        window.location.href = './event'
                        break
                    case "prestataire" :
                        window.location.href = './prestataire'
                        break  
                }
            }

        } else {
        const message = await response.text();
        messageErreur.innerHTML = message;
        }
    } catch (err) {
        messageErreur.innerHTML = 'Erreur réseau.';
    }

}


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

