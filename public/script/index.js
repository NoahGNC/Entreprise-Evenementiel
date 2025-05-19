let evenement = document.getElementById("button4")
let prestataire = document.getElementById("button5")

evenement.addEventListener("click", lanceEvenement)
prestataire.addEventListener("click", lancePrestataire)

function lanceEvenement()
{
    window.location.href = window.location.pathname + 'event'
}

function lancePrestataire()
{
    window.location.href = window.location.pathname + 'prestataire'
}

document.addEventListener("scroll", function() {
    let sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        let rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            section.style.opacity = 1;
        }
    });
});