export const format = (node, formatFunction) => {
    function updateValue(e) {
        node.value = formatFunction(node.value);
    }

    node.addEventListener('input', updateValue);
    node.addEventListener('paste', updateValue);

    // Format on initial hydration
    node.value = formatFunction(node.value);

    return {
        destroy() {
            node.removeEventListener('input', updateValue);
            node.removeEventListener('paste', updateValue);
        }
    }
};
export function formatDollar(node) {
    function update() {
        let value = node.value;
        if (!value) return;
        // Strip non-numeric characters except the decimal
        value = value.replace(/[^\d.]/g, "");
        // Format as currency with commas
        value = parseFloat(value).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        });
        node.value = value;
    }

    update(); // Run on mount

    node.addEventListener('input', update);

    return {
        destroy() {
            node.removeEventListener('input', update);
        }
    };
}

export function formatPercentage(node) {
    function update() {
        let value = node.value;
        if (!value) return;
        // Strip non-numeric characters except the decimal
        value = value.replace(/[^\d.]/g, "");
        value = `${value}%`; // Add percentage sign
        node.value = value;
    }

    update(); // Run on mount

    node.addEventListener('input', update);

    return {
        destroy() {
            node.removeEventListener('input', update);
        }
    };
}

export function stripDollar(value) {
    return parseFloat(value.replace(/[^\d.]/g, "")) || 0;
}

export function stripPercentage(value) {
    return parseFloat(value.replace(/[^\d.]/g, "")) || 0;
}
