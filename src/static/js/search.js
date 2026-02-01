function initSlider(sliderId, valueId, minInputId, maxInputId, unit="") {
    var slider = document.getElementById(sliderId);
    var valueDisplay = document.getElementById(valueId);
    var minInput = document.getElementById(minInputId);
    var maxInput = document.getElementById(maxInputId);

    var minVal = parseInt(slider.dataset.min);
    var maxVal = parseInt(slider.dataset.max);

    noUiSlider.create(slider, {
        start: [minVal, maxVal],
        connect: true,
        range: {
            'min': minVal,
            'max': maxVal
        }
    });

    slider.noUiSlider.on('update', function(values) {
        var min = Math.round(values[0]);
        var max = Math.round(values[1]);
        valueDisplay.textContent = min + unit + " - " + max + unit;
        minInput.value = min;
        maxInput.value = max;
    });
}

// 총 출력 (W)
initSlider("wattsSlider", "wattsValue", "minWatts", "maxWatts", "W");

// USB-C 포트 수
initSlider("cSlider", "cValue", "minC", "maxC");

// USB-A 포트 수
initSlider("aSlider", "aValue", "minA", "maxA");