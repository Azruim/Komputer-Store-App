const balanceElement = document.getElementById("balance");
const outLoanElement = document.getElementById("outstanding-loan");
const btnLoanElement = document.getElementById("btn-loan");
const payElement = document.getElementById("pay");
const btnRepayElement = document.getElementById("btn-repay");
const btnBankElement = document.getElementById("btn-bank");
const btnWorkElement = document.getElementById("btn-work");
const laptopsElement = document.getElementById("selection-laptops");
const laptopFeaturesElement = document.getElementById("laptop-features");
const imgLaptopElement = document.getElementById("image-laptop");
const laptopNameElement = document.getElementById("laptop-name");
const laptopDescriptionElement = document.getElementById("laptop-description");
const laptopPriceElement = document.getElementById("laptop-price");
const btnBuyElement = document.getElementById("btn-buy");

laptopsElement.addEventListener("change", handleLaptopMenuChange);

let laptops = [];

getLaptops();

async function getLaptops() {
    const response = await fetch(
        "https://noroff-komputer-store-api.herokuapp.com/computers"
    );
    laptops = await response.json();
    addLaptopsToMenu(laptops);
    laptopsElement.dispatchEvent(new Event('change'));
}

function addLaptopsToMenu(laptops) {
    laptops.forEach(function (laptop) {
        addLaptopToMenu(laptop);
    });
}

function addLaptopToMenu(laptop) {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopsElement.appendChild(laptopElement);
}

function handleLaptopMenuChange(event) {
    const selectedLaptop = laptops[event.target.selectedIndex];
    laptopFeaturesElement.innerHTML = "";
    createListForFeatures(selectedLaptop.specs);
    imgLaptopElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedLaptop.image;
    laptopNameElement.innerText = selectedLaptop.title;
    laptopDescriptionElement.innerText = selectedLaptop.description;
    laptopPriceElement.innerText = selectedLaptop.price + " €";
}

function createListForFeatures(features) {
    features.forEach(function(feature) {
        const featureElement = document.createElement("li");
        featureElement.innerText = feature;
        laptopFeaturesElement.appendChild(featureElement);
    })
}
