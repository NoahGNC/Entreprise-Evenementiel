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


function connexion(e)
{
  e.preventDefault(); // ⛔ stop le reload

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/connexion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      // ✅ Redirection si tout est bon
      window.location.href = '/event';
    } else {
      const message = await response.text();
      document.getElementById('erreur').textContent = message;
    }
  } catch (err) {
    document.getElementById('erreur').textContent = 'Erreur réseau.';
  }

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

