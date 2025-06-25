const BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const fromFlag = document.querySelector("#fromFlag");
const toFlag = document.querySelector("#toFlag");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected"; // Default from USD
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected"; // Default to INR
    }
    select.append(newOption);
  }
  select.addEventListener("change",(evt)=>{
    updateFlags(evt.target);
  });
}

// Function to update flags
const updateFlags = (element) => {
  let currCode = element.value;
    
    let countryCode = countryList[currCode];
    let src = `https://flagsapi.com/${countryCode}/shiny/64.png`
    let img = element.parentElement.querySelector('img');
    img.src = src;
};

// Fetch exchange rate and update message
const updateExchangeRate = async () => {
  try {
    const amount = document.querySelector(".amount input");
    let amtVal = amount.value || 1;
    const fromCurrency = fromCurr.value;
    const toCurrency = toCurr.value;

    const apiKey = "29d68f313a105421ef4457d9"; 
    const URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
    
    console.log("Fetching data from:", URL);

    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    let rate = data.conversion_rates[toCurrency];
    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount.toFixed(2)} ${toCurrency}`;
     // Update flags after fetching the exchange rate
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Error fetching exchange rate. Please try again.";
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Update flags on load
window.addEventListener("load", () => {
  updateFlags();
  updateExchangeRate();
});
