const balanceElement = document.getElementById("balance");
const outstandingLoanElement = document.getElementById("outstanding-loan");
const payElement = document.getElementById("pay");
const laptopsElement = document.getElementById("selection-laptops");
const laptopFeaturesElement = document.getElementById("laptop-features");
const laptopNameElement = document.getElementById("laptop-name");
const laptopDescriptionElement = document.getElementById("laptop-description");
const laptopPriceElement = document.getElementById("laptop-price");
const btnLoanElement = document.getElementById("btn-loan");
const btnRepayElement = document.getElementById("btn-repay");
const btnBankElement = document.getElementById("btn-bank");
const btnWorkElement = document.getElementById("btn-work");
const btnBuyElement = document.getElementById("btn-buy");
const imgLaptopElement = document.getElementById("image-laptop");

const payAmount = 100;
let pay = 0;
let balance = 0;
let loan = 0;
let selectedLaptopPrice = 0;
let laptops = [];

laptopsElement.addEventListener("change", handleLaptopMenuChange);
btnWorkElement.addEventListener("click", handleWork);
btnBankElement.addEventListener("click", handleBank);
btnLoanElement.addEventListener("click", handleLoan);
btnRepayElement.addEventListener("click", handleRepay);
btnBuyElement.addEventListener("click", handleBuy);

getLaptops();

// Get laptops from the API.
async function getLaptops() {
    const response = await fetch(
        "https://noroff-komputer-store-api.herokuapp.com/computers"
    );
    laptops = await response.json();
    addLaptopsToMenu(laptops);
    laptopsElement.dispatchEvent(new Event('change')); // Update laptop information areas with selected (default) laptop. 
}

// Iterate through laptops to add them to the select menu.
function addLaptopsToMenu(laptops) {
    laptops.forEach(function (laptop) {
        addLaptopToMenu(laptop);
    });
}

// Add laptops to the select menu.
function addLaptopToMenu(laptop) {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopsElement.appendChild(laptopElement);
}

// Update laptop related information when laptop selection is changed.
function handleLaptopMenuChange(event) {
    const selectedLaptop = laptops[event.target.selectedIndex];
    laptopFeaturesElement.innerHTML = "";
    createListForFeatures(selectedLaptop.specs);

    // The API had the wrong url for the 5th laptop. Fixed it by hardcoding the correct url for laptop #5.
    if (selectedLaptop.id === 5)
        imgLaptopElement.src = "https://noroff-komputer-store-api.herokuapp.com/assets/images/5.png";
    else
        imgLaptopElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedLaptop.image;

    laptopNameElement.innerText = selectedLaptop.title;
    laptopDescriptionElement.innerText = selectedLaptop.description;
    laptopPriceElement.innerText = selectedLaptop.price + " €";
    selectedLaptopPrice = selectedLaptop.price;
}

// Create and populate a <li> list for laptop specs. 
function createListForFeatures(features) {
    features.forEach(function (feature) {
        const featureElement = document.createElement("li");
        featureElement.innerText = feature;
        laptopFeaturesElement.appendChild(featureElement);
    })
}

// Handle pay.
function handleWork(event) {
    pay += payAmount;
    updateWorkAndBank();
}

// Handle banking current pay and loan deduction.
function handleBank(event) {
    if (loan === 0)
        balance += pay;

    else {
        balance += pay * 0.9;
        loan -= pay * 0.1;
    }
    pay = 0;
    updateWorkAndBank();
}

// Handle repay. Added a feature to bank the remaining pay after repaying the loan. 
function handleRepay(event) {
    if (pay > loan) {
        balance += pay - loan;
        loan = 0;
    }
    else
        loan -= pay

    pay = 0;
    updateWorkAndBank();
}

// Handle loan request.
function handleLoan(event) {
    const loanRequest = parseInt(prompt("Enter the loan amount: ", balance * 2));
    switch (loanAllowedCheck(loanRequest)) {

        case 0:
            balance += loanRequest;
            loan = loanRequest;
            alert("You have been granted a loan of " + loanRequest + " €.");
            updateWorkAndBank();
            break;

        case 1:
            alert("Loan amount is too high! Maximum loan is double the current balance.")
            break;

        case 2:
            alert("Previous loan must be repayed first!")
            break;

        case 3:
            alert("Amount must be an integer!");
    }
}

// Handle buying a new laptop.
function handleBuy(event) {
    if (buyAllowedCheck()) {
        balance -= selectedLaptopPrice;
        updateWorkAndBank();
        alert("You are now the owner of a new laptop!");
    }
    else
        alert("Insufficient balance to complete transaction!");
}

// Validate loan request. 
function loanAllowedCheck(loanAmount) {
    if (!Number.isInteger(loanAmount))
        return 3; // Not an integer.

    if (loan !== 0)
        return 2; // Previous loan not yet repayed.

    if (loanAmount > balance * 2)
        return 1; // Loan amount too high.

    return 0; // Loan request granted. 
}

// Validate buying. 
function buyAllowedCheck() {
    if (balance >= selectedLaptopPrice)
        return true;
    return false;
}

// Update bank and work related innertexts.
function updateWorkAndBank() {
    payElement.innerText = "Pay: " + pay + " €";
    balanceElement.innerText = "Balance: " + balance + " €";
    outstandingLoanElement.innerText = "Outstanding loan: " + loan + " €";

    if (loan === 0)
        btnRepayElement.style.visibility = "hidden";
    else
        btnRepayElement.style.visibility = "visible";
}