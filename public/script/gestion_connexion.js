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

let mdp = document.getElementById("mdpCreation");
let mdp2 = document.getElementById("bouttonCreation");

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
    if (suffixe=="creation" && mdp.value == mdp2.value || suffixe=="connexion"){
        

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if(suffixe == "connexion")
    {
        try {
            const response = await fetch('./api/compte/connexion', {
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
                        case "admin" :
                            window.location.href = './admin'
                            break                          
                        case "prestataire" :
                            window.location.href = './prestataire'
                            break  
                        case "evenenement_cache" :
                            window.location.href = './event' 
                            break
                        case "client" :
                            window.location.href = './mes-event'
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
        else if(suffixe == "creation")
        {
                try {
                const response = await fetch('./api/compte/envoie-verif-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
                });

                if (response.ok) {
                    window.location.href = "./verifmail"
                } else {
                    const message = await response.text();
                    console.log(message)
                }
            } catch (err) {
                console.log(err)
            }
        }             
        else{
                messageErreur.innerHTML = 'Mot de passe pas correspondant'
        }
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

