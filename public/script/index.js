let evenement = document.getElementById("boutton4")
let prestataire = document.getElementById("boutton5")


evenement.addEventListener("click", lanceEvenement)

function lanceEvenement()
{
    window.location.href = "/event"
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