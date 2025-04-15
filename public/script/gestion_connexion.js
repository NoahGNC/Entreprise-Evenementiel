const loginForm = document.getElementById("formLogin")
const createForm = document.getElementById("formCreate")
const toggleBtn = document.getElementById("btnToggle")
let b = false;

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

