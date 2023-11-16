let isCalculating = false;
let northVehicleAmount = 0;
let southVehicleAmount = 0;
let eastVehicleAmount = 0;
let westVehicleAmount = 0;
let nsTrafficStatus = "NORMAL";
let ewTrafficStatus = "NORMAL";
let calculatedTraffics = 0;
let southNorthDuration = 10;
let eastWestDuration = 10;
const yellowDuration = 2;
const SECOND = 1000;
//const detectionModel = "cocossd";
const detectionModel = "yolo";
let objectDetector;

let calculateButton;
let northTrafficImage;
let southTrafficImage;
let eastTrafficImage;
let westTrafficImage;
let northTrafficLabel;
let southTrafficLabel;
let eastTrafficLabel;
let westTrafficLabel;
let nsTrafficStatusLabel;
let ewTrafficStatusLabel;
let nsDurationLabel;
let ewDurationLabel;

function readyDriveSN() {
    hideLightsSN();

    let yellowImages = document.getElementsByClassName("yellow_h");
    for (let i = 0; i < yellowImages.length; i++) {
        yellowImages[i].style.opacity = "1";
    }

    setTimeout(startDriveSN, yellowDuration * SECOND);
}

function startDriveSN() {
    hideLightsSN();

    let greenImages = document.getElementsByClassName("green_h");
    for (let i = 0; i < greenImages.length; i++) {
        greenImages[i].style.opacity = "1";
    }

    setTimeout(finishDriveSN, southNorthDuration * SECOND);
}

function finishDriveSN(timeoutId) {
    clearTimeout(timeoutId);
    hideLightsSN();

    let yellowImages = document.getElementsByClassName("yellow_h");
    for (let i = 0; i < yellowImages.length; i++) {
        yellowImages[i].style.opacity = "1";
    }

    setTimeout(stopDriveSN, yellowDuration * SECOND);
}

function stopDriveSN(timeoutId) {
    clearTimeout(timeoutId);
    hideLightsSN();

    let redImages = document.getElementsByClassName("red_h");
    for (let i = 0; i < redImages.length; i++) {
        redImages[i].style.opacity = "1";
    }

    readyDriveEW();
}

function readyDriveEW() {
    hideLightsEW();

    let yellowImages = document.getElementsByClassName("yellow_v");
    for (let i = 0; i < yellowImages.length; i++) {
        yellowImages[i].style.opacity = "1";
    }

    setTimeout(startDriveEW, yellowDuration * SECOND);
}

function startDriveEW() {
    hideLightsEW();

    let greenImages = document.getElementsByClassName("green_v");
    for (let i = 0; i < greenImages.length; i++) {
        greenImages[i].style.opacity = "1";
    }

    setTimeout(finishDriveEW, eastWestDuration * SECOND);
}

function finishDriveEW() {
    hideLightsEW();

    let yellowImages = document.getElementsByClassName("yellow_v");
    for (let i = 0; i < yellowImages.length; i++) {
        yellowImages[i].style.opacity = "1";
    }

    setTimeout(stopDriveEW, yellowDuration * SECOND);
}

function stopDriveEW() {
    hideLightsEW();

    let redImages = document.getElementsByClassName("red_v");
    for (let i = 0; i < redImages.length; i++) {
        redImages[i].style.opacity = "1";
    }

    readyDriveSN();
}

function hideLightsSN() {
    let redImages = document.getElementsByClassName("red_h");
    for (let i = 0; i < redImages.length; i++) redImages[i].style.opacity = "0";

    let yellowImages = document.getElementsByClassName("yellow_h");
    for (let i = 0; i < yellowImages.length; i++) yellowImages[i].style.opacity = "0";

    let greenImages = document.getElementsByClassName("green_h");
    for (let i = 0; i < greenImages.length; i++) greenImages[i].style.opacity = "0";
}

function hideLightsEW() {
    let redImages = document.getElementsByClassName("red_v");
    for (let i = 0; i < redImages.length; i++) redImages[i].style.opacity = "0";

    let yellowImages = document.getElementsByClassName("yellow_v");
    for (let i = 0; i < yellowImages.length; i++) yellowImages[i].style.opacity = "0";

    let greenImages = document.getElementsByClassName("green_v");
    for (let i = 0; i < greenImages.length; i++) greenImages[i].style.opacity = "0";
}

function calculate() {
    if (isCalculating) {
        alert("Calculation is in progress...");
        return;
    } else {
        calculateButton.innerText  = "Calculating...";
        isCalculating = true;
    }

    let northImageClone = northTrafficImage.cloneNode();
    northImageClone.style.height = '1000px';
    northImageClone.style.width = '1000px';
    objectDetector.detect(northImageClone, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        northVehicleAmount = results.length;
        void calculationCompleted();
    });

    let southImageClone = southTrafficImage.cloneNode();
    southImageClone.style.height = '1000px';
    southImageClone.style.width = '1000px';
    objectDetector.detect(southImageClone, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        southVehicleAmount = results.length;
        void calculationCompleted();
    });

    let eastImageClone = eastTrafficImage.cloneNode();
    eastImageClone.style.height = '1000px';
    eastImageClone.style.width = '1000px';
    objectDetector.detect(eastImageClone, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        eastVehicleAmount = results.length;
        void calculationCompleted();
    });

    let westImageClone = westTrafficImage.cloneNode();
    westImageClone.style.height = '1000px';
    westImageClone.style.width = '1000px';
    objectDetector.detect(westImageClone, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        westVehicleAmount = results.length;
        void calculationCompleted();
    });
}

async function calculationCompleted() {
    calculatedTraffics++;

    if (calculatedTraffics >= 4) {
        calculatedTraffics = 0;
        isCalculating = false;

        calculateButton.innerText  = "Calculate";
        northTrafficLabel.innerText = northVehicleAmount;
        southTrafficLabel.innerText = southVehicleAmount;
        eastTrafficLabel.innerText = eastVehicleAmount;
        westTrafficLabel.innerText = westVehicleAmount;

        if (northVehicleAmount + southVehicleAmount <= 12) {
            nsTrafficStatus = "LIGHT";
            southNorthDuration = 5;
        } else if (northVehicleAmount + southVehicleAmount <= 16) {
            nsTrafficStatus = "NORMAL";
            southNorthDuration = 10;
        } else {
            nsTrafficStatus = "HEAVY";
            southNorthDuration = 15;
        }

        if (eastVehicleAmount + westVehicleAmount <= 12) {
            ewTrafficStatus = "LIGHT";
            eastWestDuration = 5;
        } else if (eastVehicleAmount + westVehicleAmount <= 16) {
            ewTrafficStatus = "NORMAL";
            eastWestDuration = 10;
        } else {
            ewTrafficStatus = "HEAVY";
            eastWestDuration = 15;
        }

        if (nsTrafficStatus === "HEAVY" && ewTrafficStatus === "HEAVY") {
            southNorthDuration = 10;
            eastWestDuration = 10;
        }

        nsTrafficStatusLabel.innerText = nsTrafficStatus;
        ewTrafficStatusLabel.innerText = ewTrafficStatus;
        nsDurationLabel.innerText = southNorthDuration + " s";
        ewDurationLabel.innerText = eastWestDuration + " s";
    }
}

async function initializeDetector() {
    isCalculating = true;
    objectDetector = await ml5.objectDetector(detectionModel, detectorInitialized);
}

function detectorInitialized() {
    calculateButton.innerText  = "Calculate";

    isCalculating = false;

    stopDriveEW();
}

function onImageClicked(event) {
    let imageElement = event.currentTarget;
    let currentImageName = imageElement.src;
    if (currentImageName.includes("light_traffic")) {
        imageElement.src = "img/normal_traffic.jpg";
    } else if (currentImageName.includes("normal_traffic")) {
        imageElement.src = "img/heavy_traffic.jpg";
    } else if (currentImageName.includes("heavy_traffic")) {
        imageElement.src = "img/light_traffic.jpg";
    }
}

window.addEventListener('DOMContentLoaded', function () {
    calculateButton = document.getElementById("calculate-btn");
    calculateButton.innerText  = "Initializing...";

    northTrafficImage = document.getElementById("north-traffic");
    southTrafficImage = document.getElementById("south-traffic");
    eastTrafficImage = document.getElementById("east-traffic");
    westTrafficImage = document.getElementById("west-traffic");

    northTrafficLabel = document.getElementById("north-traffic-label");
    southTrafficLabel = document.getElementById("south-traffic-label");
    eastTrafficLabel = document.getElementById("east-traffic-label");
    westTrafficLabel = document.getElementById("west-traffic-label");

    nsTrafficStatusLabel = document.getElementById("north-south-status-label");
    ewTrafficStatusLabel = document.getElementById("east-west-status-label");
    nsDurationLabel = document.getElementById("ns-duration-label");
    ewDurationLabel = document.getElementById("ew-duration-label");

    northTrafficImage.addEventListener("click", onImageClicked);
    southTrafficImage.addEventListener("click", onImageClicked);
    eastTrafficImage.addEventListener("click", onImageClicked);
    westTrafficImage.addEventListener("click", onImageClicked);

    hideLightsSN();
    hideLightsEW();
    void initializeDetector();
});