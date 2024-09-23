<script>
    import * as d3 from "d3";
    export let mortgageData;

    let width = 450;
    let height = 450;
    let margin = 40;
    let radius = Math.min(width, height) / 2 - margin;
    let selectedLabel = "Total"; // For hover effect

    // Initialize the selected value to the total of mortgageData
    $: selectedValue = Object.values(mortgageData).reduce((a, b) => a + b, 0); // Reactive to mortgageData changes

    // Set the color scale
    const color = d3
        .scaleOrdinal()
        .domain(Object.keys(mortgageData))
        .range(["#0255A3", "#CD0000", "#FFC528"]);

    const pie = d3
        .pie()
        .sort(null)
        .value((d) => d[1]);

    $: data_ready = pie(Object.entries(mortgageData)); // Reactive to mortgageData changes

    const arc = d3
        .arc()
        .innerRadius(radius * 0.75)
        .outerRadius(radius * 1.0);

    function handleMouseOver(slice) {
        selectedLabel = slice.data[0];
        selectedValue = slice.data[1];
    }

    function handleMouseOut() {
        selectedLabel = "Total";
        // Recalculate total value reactively
        selectedValue = Object.values(mortgageData).reduce((a, b) => a + b, 0);
    }
    
    // Utility to wrap text based on length and donut size
    function wrapText(text, width) {
        const words = text.split(' ');
        let line = '';
        const lines = [];

        words.forEach(word => {
            if ((line + word).length < width) {
                line += word + ' ';
            } else {
                lines.push(line.trim());
                line = word + ' ';
            }
        });

        lines.push(line.trim()); // Push last line
        return lines;
    }
</script>

<svg
    {width}
    {height}
    viewBox="{-width / 2}, {-height / 2}, {width}, {height}"
    style:max-width="100%"
    style:height="auto"
    >
    <g class="chart-inner">
        {#each data_ready as slice}
        <path
            d={arc(slice)}
            fill={color(slice.data[0])}
            stroke="white"
            on:mouseover={() => handleMouseOver(slice)}
            on:mouseout={handleMouseOut}
        />
        {/each}
    </g>

    <!-- Display the selected label and value inside the donut -->
    <text
        y="40"
        text-anchor="middle"
        alignment-baseline="middle"
        font-size="{Math.min(32, radius / 5)}"
    >
        {#each wrapText(selectedLabel, 10) as line, i}
            <tspan x="0" dy={i === 0 ? 0 : "1.2em"}>{line}</tspan>
        {/each}
    </text>

    <text
        y="-10"
        text-anchor="middle"
        alignment-baseline="middle"
        font-size="{Math.min(47, radius / 4)}"
        font-weight="bold"
    >
        ${selectedValue | 0} /mo
    </text>
</svg>

<style>
svg {
    display: block;
    margin: auto;
}

.chart-inner path {
    transition: transform 0.2s ease-in-out;
}

.chart-inner path:hover {
    transform: scale(1.05);
}

text {
    fill: #333;
}
</style>
