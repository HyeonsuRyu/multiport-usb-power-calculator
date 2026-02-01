document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".port-img").forEach(img => {
        img.addEventListener("click", () => {
            const portLabel = img.dataset.label;
            const spec = portsData[portLabel];
            const infoElement = document.querySelector(`.port-info[data-port="${portLabel}"]`);

            if (!spec || !infoElement) return;

            if (img.classList.contains("selected")) {
                img.classList.remove("selected");
                resetImage(img);
                // 원래 정보 복원
                infoElement.innerHTML = `${spec.type}<br>(Max. ${spec.max_wattage}W)`;
            } else {
                img.classList.add("selected");
                setSelectedImage(img);
                const current = spec.current_wattage || spec.max_wattage;
                // 줄바꿈 포함 출력
                infoElement.innerHTML = `${spec.type}<br>${current}W<br>(Max. ${spec.max_wattage}W)`;
            }
        });
    });
});

function setSelectedImage(img) {
    const type = img.dataset.type;
    if (type === "A") {
        img.src = "/static/images/A_selected.png";
    } else if (type === "C") {
        img.src = "/static/images/C_selected.png";
    }
}

function resetImage(img) {
    const type = img.dataset.type;
    if (type === "A") {
        img.src = "/static/images/A.png";
    } else if (type === "C") {
        img.src = "/static/images/C.png";
    }
}

function updatePortInfo(selectedPorts) {
    const count = selectedPorts.length;
    // 문자열 키로 접근
    const profiles = portsData.profiles ? portsData.profiles[String(count)] : null;
    let distribution = null;

    console.log("=== Debugging updatePortInfo ===");
    console.log("Selected Ports:", selectedPorts);
    console.log("Count:", count, "Profiles key:", String(count));
    console.log("Profiles available:", profiles);

    if (profiles) {
        for (const profile of profiles) {
            const active = profile.active_ports.map(p => p.trim().toUpperCase()).sort().join(",");
            const selected = [...selectedPorts].map(p => p.trim().toUpperCase()).sort().join(",");
            console.log("Checking profile:", active, "vs", selected);

            if (active === selected) {
                distribution = profile.distribution;
                console.log("Matched distribution:", distribution);
                break;
            }
        }
    } else {
        console.log("No profiles defined for count:", count);
    }

    let sum = 0;
    selectedPorts.forEach(port => {
        const spec = portsData.ports[port];
        const infoElement = document.querySelector(`.port-info[data-port="${port}"]`);
        if (!spec || !infoElement) return;

        let currentText;
        if (distribution && distribution[port] !== undefined) {
            const current = distribution[port];
            currentText = `${spec.type}<br>${current}W<br>(Max. ${spec.max_wattage}W)`;
            sum += current;
        } else {
            currentText = `${spec.type}<br>NULL<br>(Max. ${spec.max_wattage}W)`;
        }

        infoElement.innerHTML = currentText;
    });

    const totalOutput = document.getElementById("totalOutput");
    if (distribution) {
        totalOutput.textContent = `총합 출력: ${sum}W`;
    } else if (selectedPorts.length > 0) {
        totalOutput.textContent = `총합 출력: NULL`;
    } else {
        totalOutput.textContent = "";
    }
}

let selectedPorts = [];

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".port-img").forEach(img => {
        img.addEventListener("click", () => {
            const portLabel = img.dataset.label;

            if (selectedPorts.includes(portLabel)) {
                selectedPorts = selectedPorts.filter(p => p !== portLabel);
                img.classList.remove("selected");
                resetImage(img);

                // 원래 정보 복원
                const spec = portsData.ports[portLabel];
                const infoElement = document.querySelector(`.port-info[data-port="${portLabel}"]`);
                if (spec && infoElement) {
                    infoElement.innerHTML = `${spec.type}<br>(Max. ${spec.max_wattage}W)`;
                }
            } else {
                selectedPorts.push(portLabel);
                img.classList.add("selected");
                setSelectedImage(img);
            }

            updatePortInfo(selectedPorts);
        });
    });
});
