const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");
const rangeValue = document.getElementById("rangeValue");

function updateRange() {
    let minVal = parseInt(minRange.value);
    let maxVal = parseInt(maxRange.value);
    if (minVal > maxVal) {
        [minVal, maxVal] = [maxVal, minVal];
    }
    rangeValue.textContent = minVal + "W - " + maxVal + "W";
}

minRange.addEventListener("input", updateRange);
maxRange.addEventListener("input", updateRange);
updateRange();