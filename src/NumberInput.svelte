<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    // Forward the click event
    function handleClick(event) {
        dispatch('click', event); // Dispatching click event to parent
    }
    function handleBlur(event) {
        dispatch('blur', event); // Dispatch the blur event to the parent
    }

    
    export let value = "123456"; // Initial value, passed as a prop
    export let isPercentage = false; // Prop to toggle between currency and percentage

    // Function to strip non-numeric characters, but allow a single decimal for percentages
    const parse = (value, isPercentage) => {
        if (isPercentage) {
            // Allow digits and a single decimal point for percentage
            const parts = value.split('.');
            return parts.length > 2 ? parts[0] + '.' + parts[1] : value.replace(/[^0-9.]/g, '');
        } else {
            return value.replace(/\D+/g, '');
        }
    };

    // Function to round the number and format it with commas
    const formatWithCommas = (number) => {
        return number ? Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
    };


    // Function to handle formatting based on whether it's a percentage or currency
    const formatValue = (value, isPercentage) => {
        if (isPercentage) {
            // Do not add commas for percentages, return as-is with percentage symbol
            return `${value}`;
        } else {
            const formattedNumber = formatWithCommas(value);
            return `${formattedNumber}`;
        }
    };

    // Update the formatted value based on the input type (currency or percentage)
    $: formattedValue = formatValue(value, isPercentage);

    // When the input changes, update the value
    const onChange = (event) => {
        const rawValue = parse(event.target.value, isPercentage);
        value = rawValue;
        formattedValue = formatValue(rawValue, isPercentage);
    };
</script>

<div class="input-container">
    {#if !isPercentage}
        <span class="currency-symbol">$</span>
    {/if}
    <input
        type="text"
        class="form-input"
        bind:value={formattedValue}
        on:input={onChange}
        on:click={handleClick} 
        on:blur={handleBlur} 
    />
    {#if isPercentage}
        <span class="percentage-symbol">%</span>
    {/if}
</div>

<style>
  .input-container {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  :root {
    --fontsize: 1.4rem;
}
  
  .currency-symbol {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--fontsize);
    color: #000;
    pointer-events: none;
  }

  .percentage-symbol {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--fontsize);
    color: #000;
    pointer-events: none;
  }

  .form-input {
    padding-left: 35px;
    padding-right: 35px; /* Adjust for percentage symbol on the right */
    font-size: var(--fontsize);
    font-weight: bold;
    border: 2px solid #8f9193;
    border-radius: 8px;
    height: 45px;
    width: 100%;
    box-sizing: border-box;
    background-color: #FFFFFF;
    color: #000;
    outline: none;
  }

  .form-input:focus {
    border-color: #0066ff;
  }
</style>
