let form = document.getElementById("form")
form.addEventListener("submit", creerCompte)

let erreur = document.getElementById("erreur")

async function creerCompte(e)
{
    e.preventDefault()

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

        try {
        const response = await fetch('./api/compte/creation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        });

        if (response.ok) {
                            const data = await response.json();
                console.log(data)
                if(data.success)
                {
                    erreur.innerHTML = data
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
            erreur.innerHTML = message
        }
    } catch (err) {
        console.log(err)
    }
}

