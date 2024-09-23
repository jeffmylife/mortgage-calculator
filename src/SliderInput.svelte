<script>
export let value = 123456; // Initial value, passed as a prop
export let minRange = 50000;
export let maxRange = 2000000;
export let step = 1000;

const onSliderChange = (event) => {
    value = event.target.value; // This will automatically update the parent (App.svelte)
};
</script>

<div class="slider-container">
    <input
        type="range"
        class="slider"
        bind:value={value}
        min={minRange}
        max={maxRange}
        step={step}
        />
</div>

  
  <style>
.slider {
    width: 100%;
    margin-top: 20px;
    height: 15px;
    background-color: #ddd;
    border-radius: 5px;
    -webkit-appearance: none; /* Remove default appearance in Chrome */
    appearance: none;
}

.slider::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    background-color: #ddd;
    border-radius: 5px;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--thumb-width);
    height: var(--thumb-height);
    background-color: #007bff;
    border-radius: 50%;
    cursor: pointer;
    margin-top: calc((-1 * var(--thumb-height) / 2) + 4px); /* Adjust this value */
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2); /* Optional: Add slight shadow */
}

.slider::-moz-range-track {
    width: 100%;
    height: 8px;
    background-color: #ddd;
    border-radius: 5px;
}

.slider::-moz-range-thumb {
    width: var(--thumb-width);
    height: var(--thumb-height);
    background-color: #007bff;
    border-radius: 50%;
    cursor: pointer;
}

.slider::-ms-track {
    width: 100%;
    height: 8px;
    background-color: transparent; /* Hide default track */
    border-color: transparent;
    border-width: 6px 0;
    color: transparent;
    border-radius: 5px;
}

.slider::-ms-fill-lower {
    background-color: #ddd;
    border-radius: 5px;
}

.slider::-ms-fill-upper {
    background-color: #ddd;
    border-radius: 5px;
}

.slider::-ms-thumb {
    width: var(--thumb-width);
    height: var(--thumb-height);
    background-color: #007bff;
    border-radius: 50%;
    cursor: pointer;
}

:root {
    --thumb-width: 30px;
    --thumb-height: 30px;
}

</style>
