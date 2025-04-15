// CONSTANTES

const semaine = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

const dataEx = [["Mariage Jean", "Anniversaire Anne"],
[],
[],
["Anniversaire Yollande"],
[],
["Mariage Sacha"],
[],]


let panelDroit = document.getElementById("panelDroit")
let table
let decalage = 0


export function startAgenda()
{
    panelDroit.innerHTML = ""
    table = document.createElement("table")
    table.id = "calendrier"
    panelDroit.appendChild(table)
    remplirEntete()
    remplirContenu()
}




function semainePrecedente()
{
    decalage -= 7
    console.log(decalage)
    table.innerHTML = ""
    remplirEntete()
    remplirContenu()
}

function semaineSuivante()
{
    decalage += 7
    console.log(decalage)
    table.innerHTML = ""
    remplirEntete()
    remplirContenu()
}

function getLundiDernier()
{
    let res = new Date()
    res.setDate((res.getDate() - (res.getDay() + 6) % 7) + decalage)
    return res;
}

function remplirEntete()
{   
    let bonJour = getLundiDernier()
    let tr = document.createElement("tr")

    let precedent = document.createElement("button")
    precedent.className = "boutonCalendrier"
    precedent.innerHTML = "←"
    precedent.addEventListener("click", semainePrecedente)

    tr.appendChild(precedent)

    for(let i = 0; i < 7; i++){
        let td = document.createElement("td")
        td.innerHTML = semaine[i] + " " + bonJour.getDate() + " " + mois[bonJour.getMonth()] + " " + bonJour.getFullYear()
        td.className = "enteteCalendrier"
        tr.appendChild(td)

        bonJour.setDate(bonJour.getDate() + 1)
    };

    let suivant = document.createElement("button")
    suivant.className = "boutonCalendrier"
    suivant.innerHTML = "→"
    suivant.addEventListener("click", semaineSuivante)

    tr.appendChild(suivant)
    
    table.appendChild(tr)
}

function remplirContenu()
{
        let tr = document.createElement("tr")
        tr.appendChild(document.createElement("div"))
        for(let i = 0; i < 7; i++)
        {
            let td = document.createElement("td")
            dataEx[i].forEach(element => {
                let div = document.createElement("button")

                
                div.innerHTML = element
                div.className = "evenementCalendrier"
                td.appendChild(div)
            });
            
            td.className = "contenuCalendrier"
            tr.appendChild(td)
        }      
        table.appendChild(tr)
}