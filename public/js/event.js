// Function to remove a component
function removeComponent(element) {
    
      const component = element.parentElement;
      component.remove();
      updateTotalPrice();
    
  }

  // Function to add a new component dynamically
  function addComponent() {
    document.getElementById("popup-modal").classList.remove("hidden");
    updateTotalPrice();
  }

  function closePopup() {
    // Cacher le popup
    document.getElementById("popup-modal").classList.add("hidden");
  }

  // Function to update the total price
  // Fonction pour mettre à jour le prix total
  function updateTotalPrice() {
    const components = document.querySelectorAll(".component-item");
    let totalPrice = 0;
  
    // Parcours des composants et addition des prix
    components.forEach((component) => {
      const priceText = component.querySelector("p:nth-child(3)").textContent.replace("€", "").trim();
      const price = parseFloat(priceText);
      if (!isNaN(price)) {
        totalPrice += price;
      }
    });
  
    // Mettre à jour le texte du prix total sur la page
    document.getElementById("total-price").textContent = `Prix Total Estimé : ${totalPrice}€`;
  }

  
  function selectComponent(name, price, imageSrc) {
  // Ajouter le composant sélectionné à la liste
  const componentsContainer = document.querySelector(".sep");
  const newComponent = document.createElement("div");
  newComponent.className = "component-item";
  newComponent.innerHTML = `
    <img src="${imageSrc}" alt="${name}">
    <span class="remove" onclick="removeComponent(this)">❌</span>
    <p>${name}</p>
    <p>${price}€</p>
  `;
  componentsContainer.appendChild(newComponent);

  // Mettre à jour le prix total après l'ajout du composant
  updateTotalPrice();

  // Fermer le popup après la sélection
  closePopup();
}

  