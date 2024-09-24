<script>
import DonutChart from './DonutChart.svelte';
import NumberInput from './NumberInput.svelte';
import SliderInput from './SliderInput.svelte';

let homePrice = 425000;

let downPayment = 85000;
let downPaymentPercentage = (downPayment / homePrice) * 100;
let loanTerm = 30;
let interestRate = 6.05;
let propertyTaxRate = 1.2; // %
let insuranceRate = 0.35; // %
let showAdvancedSettings = false; // Toggle for advanced settings

let propertyTax = 0;
let insurance = 0;
let principalInterest = 0;
let monthlyPayment = 0;
let totalMonthlyPayment = 0;

let mortgageData = {
    "Principal & Interest": principalInterest,
    "Property Tax": propertyTax,
    "Homeowner's Insurance": insurance
};
let activeInput = '';


// Format a number as a dollar value
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function calculateMortgage() {
    // avoid cyclical dependency
    if (activeInput === 'downPayment') {
        downPaymentPercentage = (downPayment * 100) / homePrice;
    }
    
    const principal = homePrice - downPayment;
    const monthlyInterest = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    monthlyPayment = Math.round(
        (principal * monthlyInterest * Math.pow(1 + monthlyInterest, totalPayments)) /
        (Math.pow(1 + monthlyInterest, totalPayments) - 1)
    );

    principalInterest = monthlyPayment;

    insurance = (insuranceRate / 100) * homePrice / 12;
    propertyTax = (propertyTaxRate / 100) * homePrice / 12;

    mortgageData = {
        "Principal & Interest": principalInterest,
        "Property Tax": Math.round(propertyTax),
        "Homeowner's Insurance": Math.round(insurance)
    };

    totalMonthlyPayment = Object.values(mortgageData).reduce((a, b) => a + b, 0); 
}

function resetForm() {
    homePrice = 425000;
    downPayment = 85000;
    downPaymentPercentage = (downPayment / homePrice) * 100;
    loanTerm = 30;
    interestRate = 6.05;
    propertyTaxRate = 1.2;
    insuranceRate = 0.35;
    calculateMortgage(); // Recalculate with the default values
}

// Function to toggle advanced settings
function toggleAdvancedSettings() {
    showAdvancedSettings = !showAdvancedSettings;
}

function onDownPaymentClick() {
    activeInput = 'downPayment';
}
function onDownPaymentBlur() {
    activeInput = '';
}

// Reactive blocks to trigger mortgage recalculation on variable changes
$: if (homePrice) {
    downPayment = (downPaymentPercentage / 100) * homePrice;
    calculateMortgage();
}
$: if (downPayment) calculateMortgage();
$: if (loanTerm) calculateMortgage();
$: if (interestRate) calculateMortgage();
$: if (propertyTaxRate) calculateMortgage();
$: if (insuranceRate) calculateMortgage();
</script>

<div class="container">
    <div class="form">
        <h2>Calculate your Payment</h2>
        
        <label for="homePrice">
            Home Price
            <NumberInput bind:value={homePrice} minRange="50000" maxRange="20000000" on:input={calculateMortgage}/>
            <SliderInput bind:value={homePrice} minRange="50000" maxRange="5000000" step="1000" />
        </label>

        <label for="downPayment">
            Down payment
            <div class="down-payment-inputs">
                <NumberInput bind:value={downPayment} minRange="50000" maxRange={homePrice} on:click={onDownPaymentClick} on:blur={onDownPaymentBlur} />
                <NumberInput bind:value={downPaymentPercentage} isPercentage={true}/>
            </div>
            <SliderInput bind:value={downPaymentPercentage} minRange="0" maxRange="45" step="0.5" />
        </label>

        <label>
            Loan term
            <select bind:value={loanTerm} on:change={calculateMortgage}>
                <option value={15}>15 years</option>
                <option value={30}>30 years</option>
            </select>
        </label>

        <label for="interestRate">
            Interest rate (%)
            <NumberInput bind:value={interestRate} isPercentage={true} on:input={calculateMortgage} />
            <SliderInput bind:value={interestRate} minRange="1" maxRange="10" step="0.01" on:input={calculateMortgage} />
        </label>

        <!-- Modern Advanced Settings toggle button -->
        <button class="toggle-settings-button" on:click={toggleAdvancedSettings}>
            {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
        </button>

        {#if showAdvancedSettings}
        <div class="advanced-settings">
            <h3>Advanced Settings</h3>

            <label for="propertyTax">
                Property Tax Rate
                <NumberInput bind:value={propertyTaxRate} isPercentage={true} minRange="0" maxRange="5" on:input={calculateMortgage} />
            </label>
            <p>Property taxes are often calculated at around 1.2% of the home's value, though rates may differ depending on where you live. Your Loan Officer can assist in finding the specific property tax rates for your area.</p>

            <label for="insurance">
                Homeowner's Insurance Rate
                <NumberInput bind:value={insuranceRate} isPercentage={true} minRange="0" maxRange="5" on:input={calculateMortgage} />
            </label>

            <p>Homeowners insurance is usually about 0.35% of the home's value annually, but this amount can fluctuate based on the insurer.</p>
        </div>
        {/if}

        <button class="start-over-button" on:click={resetForm}>Start Over</button>
    </div>

    <div class="results-container">
        <h2>Estimated Monthly Payment Breakdown</h2>
        <div class="breakdown-container">
            <div class="breakdown-chart">
                <DonutChart {mortgageData} />
            </div>
            <div class="breakdown-labels">
                <div class="label-item">
                    <div class="label-text">
                        <div class="label-color principal-color"></div>
                        Principal & Interest
                    </div>
                    <div class="label-value">
                        <strong>{formatCurrency(Math.round(principalInterest))}</strong>
                    </div>
                </div>

                <div class="label-item">
                    <div class="label-text">
                        <div class="label-color tax-color"></div>
                        Property Tax
                    </div>
                    <div class="label-value">
                        <strong>{formatCurrency(Math.round(propertyTax / 12))}</strong>
                    </div>
                </div>

                <div class="label-item">
                    <div class="label-text">
                        <div class="label-color insurance-color"></div>
                        Homeowner's Insurance
                    </div>
                    <div class="label-value">
                        <strong>{formatCurrency(Math.round(insurance / 12))}</strong>
                    </div>
                </div>

                <div class="label-item total">
                    <strong>Total:</strong>
                    <strong>{formatCurrency(Math.round(totalMonthlyPayment))} / Month</strong>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
:root {
    --primary-color: #0255A3;
    --primary-hover-color: #005bb5;
    --secondary-color: #00c6ff;
    --secondary-hover-color: #0072ff;
    --background-color: #ffffff;
    --border-color: #ddd;
    --light-gray-color: #e0e0e0;
    --shadow-color: rgba(0, 0, 0, 0.1);
    --principal-color: #0255A3;
    --tax-color: #CD0000;
    --insurance-color: #FFC528;
    --input-focus-color: #007aff;
    --input-background-color: #f9f9f9;
}

.container {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 0;
    gap: 40px;
    flex-wrap: wrap;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 30%;
    min-width: 250px;
    flex-grow: 1;
}

@media (max-width: 768px) {
    .form {
        width: 100%;
        padding: 0 10px;
    }
}

.results-container {
    padding: 40px;
    border-radius: 8px;
    background-color: var(--background-color);
    flex-grow: 2;
    box-sizing: border-box;
    box-shadow: 0px 4px 10px var(--shadow-color);
    border: 1px solid var(--border-color);
    margin-top: 20px;
    font-size: 1.2rem;
    width: 65%;
}

@media (max-width: 768px) {
    .results-container {
        width: 100%;
        padding: 20px;
        margin-top: 20px;
    }
}

.start-over-button {
    background: linear-gradient(to right, var(--secondary-color), var(--secondary-hover-color));
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
    text-align: center;
    margin-top: 20px;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.start-over-button:hover {
    background: linear-gradient(to right, var(--secondary-hover-color), var(--secondary-color));
    box-shadow: 0px 8px 15px rgba(0, 118, 255, 0.3);
}


.breakdown-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    width: 100%;
}

.breakdown-chart {
    display: flex;
    justify-content: center;
    width: 60%;
}

.breakdown-labels {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 40%;
    font-size: 1.1rem;
}

.label-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--light-gray-color);
}

.label-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 10px;
}

h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
}

.label-text {
    display: flex;
    align-items: center;
}

.total {
    padding-top: 15px;
    border-top: 2px solid var(--light-gray-color);
}

@media (max-width: 768px) {
    .label-item {
        flex-direction: column;
        gap: 5px;
    }

    .label-text,
    .label-input {
        width: 100%;
    }
}

.principal-color {
    background-color: var(--principal-color);
}

.tax-color {
    background-color: var(--tax-color);
}

.insurance-color {
    background-color: var(--insurance-color);
}

.form select {
    padding: 14px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 1.1rem;
    width: 100%;
    box-sizing: border-box;
}

.form label {
    font-weight: bold;
    font-size: 1rem;
}

.down-payment-inputs {
    display: flex;
    gap: 10px;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
}

.toggle-settings-button {
    background: linear-gradient(to right, var(--secondary-color), var(--secondary-hover-color));
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
    text-align: center;
    margin-top: 20px;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.toggle-settings-button:hover {
    background: linear-gradient(to right, var(--secondary-hover-color), var(--secondary-color));
    box-shadow: 0px 8px 15px rgba(0, 118, 255, 0.3);
}

.advanced-settings input {
    width: 100%;
    padding: 10px;
    font-size: 1.2rem;
    border: 2px solid var(--border-color);
    border-radius: 10px;
    margin: 10px 0;
    box-shadow: 0px 4px 6px var(--shadow-color);
    transition: border-color 0.3s ease;
}

.advanced-settings input:focus {
    border-color: var(--input-focus-color);
    outline: none;
}

.advanced-settings {
    margin-top: 20px;
    padding: 20px;
    background-color: var(--input-background-color);
    border-radius: 15px;
    box-shadow: 0px 4px 10px var(--shadow-color);
}

</style>
