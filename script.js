// VARIABLE
const oxygenCounter = document.querySelector("#oxygenCounter")
let oxygen = oxygenCounter.innerText = 25
let treeData = [
    {"name": "oak",     "id": 0, "img": null, "price": 20, "sell": 10, "amount": 0, "production": 1},
    {"name": "spruce",  "id": 1, "img": null, "price": 150, "sell": 75, "amount": 0, "production": 3},
    {"name": "birch",   "id": 2, "img": null, "price": 500, "sell": 250, "amount": 0, "production": 10},
    {"name": "pine",    "id": 3, "img": null, "price": 1000, "sell": 500, "amount": 0, "production": 25},
    {"name": "fir",     "id": 4, "img": null, "price": 2000, "sell": 1000, "amount": 0, "production": 50},
    {"name": "maple",   "id": 5, "img": null, "price": 5000, "sell": 2500, "amount": 0, "production": 100},
    {"name": "willow",  "id": 6, "img": null, "price": 10000, "sell": 5000, "amount": 0, "production": 200},
    {"name": "poplar",  "id": 7, "img": null, "price": 20000, "sell": 10000, "amount": 0, "production": 500},
    {"name": "cedar",   "id": 8, "img": null, "price": 50000, "sell": 25000, "amount": 0, "production": 1000},
    {"name": "ash",     "id": 9, "img": null, "price": 100000, "sell": 50000, "amount": 0, "production": 2500},
]
const treePriceMultiplier = 1.15;
let treeCounter = 0
let forestTiles = []
const forest = document.querySelector("#forest")
const ctx = forest.getContext("2d");
let forestDensityCap = 0.8
let tileSize = 60
const rem = parseInt(getComputedStyle(document.body).fontSize.slice(0, -2))
let xAnchor = rem * 6
let yAnchor = rem * 4
let isMoving = false
let xRel = 0
let yRel = 0
let achievementData = [];
let aquiredAchievement = [];
let playTime = 0
let isSaving = true;

const mainMenu = document.querySelector("#mainMenu")
const menuSections = document.querySelectorAll(".menuSection")
const buyTreeList = document.querySelector("#buyTreeList")
const sellTreeList = document.querySelector("#sellTreeList")
const investorList = ["Green Home", "EcoTech", "Tree Hugger Co.", "Clean Roots", "Carbonless", "Clean Air Foundation", "Team Trees", "Vegetation Nation", "Peace, Love, and Plants", "Tree Conservation Co.", "Circle of Nature"];
const investorName = document.querySelector("#investorName")
const investorDemand = document.querySelector("#investorDemand")
const investorVolatility = document.querySelector("#investorVolatility")
const investorTimePeriod = document.querySelector("#investorTimePeriod")
let currentInvestor = {"name": "", "demand": 0, "volatility": 0, "time": 0}
const investorActions = document.querySelector("#investorActions")
const investorWait = document.querySelector("#investorWait")
const investmentBanner = document.querySelector("#investmentBanner")
const achievementList = document.querySelector("#achievementList")
const statsTreeCounter = document.querySelector("#statsTreeCounter")
const statsProductionCounter = document.querySelector("#statsProductionCounter")
const statsAchievementCounter = document.querySelector("#statsAchievementCounter")
const statsTotalAchievements = document.querySelector("#statsTotalAchievements")
const statsPlayTime = document.querySelector("#statsPlayTime")
const saveDataDisplay = document.querySelector("#saveDataDisplay")

let lastLoopIter = Date.now();


// CANVAS FUNCTIONS
forest.width = forest.clientWidth;
forest.height = forest.clientHeight;

forest.onmousedown = forest.ontouchstart = (event) => {
    isMoving = true
    xRel = event.pageX - xAnchor;
    yRel = event.pageY - yAnchor;
}

forest.onmousemove = forest.ontouchmove = (event) => {
    if (isMoving) {
        xAnchor = Math.max(Math.min(event.pageX - xRel, rem * 6), forest.width - ((xTiles * tileSize) + (rem * 6)))
        yAnchor = Math.max(Math.min(event.pageY - yRel, rem * 4), forest.height - ((yTiles * tileSize) + (rem * 4)))

        redrawForest()
    }
}

forest.onmouseup = forest.ontouchend = (event) => {
    isMoving = false
}

// FOREST FUNCTIONS
let xTiles = Math.round((document.body.clientWidth - (rem * 12)) / tileSize) // 6rem on each side
let yTiles = Math.round((document.body.clientHeight - (rem * 8)) / tileSize) // 4rem on each side
let maxTiles = xTiles * yTiles

for (let y = 0; y < yTiles; y++) {
    forestTiles.push([])
    for (let x = 0; x < xTiles; x++) {
        forestTiles[y].push("X")
    }
}

function checkForestExpansion() {
    if (treeCounter / maxTiles >= forestDensityCap) {
        xTiles += 1
        yTiles += 1
        for (let y = 0; y < yTiles - 1; y++) { // "yTiles - 1" add an "X" on every exisitng row
            forestTiles[y].push("X")
        }
        forestTiles.push([]) // Create extra row
        for (let x = 0; x < xTiles; x++) { // Fill last row with correct number of "X"s
            forestTiles[forestTiles.length - 1].push("X")
        }
        maxTiles = xTiles * yTiles
    }
}

function redrawForest() {
    ctx.clearRect(0, 0, forest.width, forest.height)
    for (let y = 0; y < yTiles; y++) {
        for (let x = 0; x < xTiles; x++) {
            if (forestTiles[y][x] != "X") {
                let currentTree = forestTiles[y][x]
                ctx.drawImage(treeData[currentTree.id].img, currentTree.x * tileSize + xAnchor, currentTree.y * tileSize + yAnchor, tileSize, tileSize)
            }
        }
    }
}

// TREE FUNCTIONS
function addTree(id) {
    if (treeCounter == maxTiles) {
        console.error("Forest is already filled")
        return 0
    }

    let xPos = getRandom(0, xTiles - 1)
    let yPos = getRandom(0, yTiles - 1)
    let isOverlaping = true

    while (isOverlaping) {
        if (forestTiles[yPos][xPos] == "X") {
            forestTiles[yPos][xPos] = {
                "x": xPos,
                "y": yPos,
                "id": id 
            }
            isOverlaping = false
            break
        }
        else {
            xPos = getRandom(0, xTiles - 1)
            yPos = getRandom(0, yTiles - 1)
        }
    };
    
    ctx.drawImage(treeData[id].img, xPos * tileSize + xAnchor, yPos * tileSize + yAnchor, tileSize, tileSize)
    treeCounter += 1
    statsTreeCounter.innerText = treeCounter
    checkForestExpansion()
}

// IMAGE LOAD
function loadImage() {
    for (let x = 0; x < treeData.length; x++) {
        let treeImg = new Image()
        treeImg.src = `src/trees/${treeData[x].name}.png`
        treeImg.classList.add("treeIcon")
        treeData[x].img = treeImg;
    }
    treeData[treeData.length - 1].img.onload = () => { // When last tree loads
        for (let x = 0; x < treeData.length; x++) {
            menuAppendBuyTreeList(x);
            menuAppendSellTreeList(x);
        }
    }
}

loadImage()

// OXYGEN FUNCTIONS
function changeOxygen(int) {
    oxygen += int
    oxygenCounter.innerText = oxygen;
}

function setOxygen(int) {
    oxygen = int
    oxygenCounter.innerText = oxygen;
}

// UTILITY
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function drawGrid() {
    ctx.strokeStyle = "black";
    for (let x = 0; x < xTiles; x++) {
        for (let y = 0; y < yTiles; y++) {
            ctx.strokeRect(x * tileSize + xAnchor, y * tileSize + yAnchor, tileSize, tileSize);
        }
    }
}

// MENU FUNCTION
function openMenu() {
    mainMenu.showModal()
    openSection(0)
    document.body.style.backgroundColor = `rgb(0, 90, 0)`; // Change grass color for notch
}

function closeMenu() {
    mainMenu.classList.add('hideDialogue');
    setTimeout(() => {
        mainMenu.classList.remove('hideDialogue');
    }, 500)
    mainMenu.close()
    document.body.style.backgroundColor = `rgb(0, 128, 0)`; // Change grass color for notch
}

function openSection(id) {
    menuSections.forEach(element => {
        element.style.display = "none";
    });
    mainMenu.scrollTo(0, 0)
    menuSections[id].style.display = "block";
}

// BUY TREE FUNCTIONS
function menuAppendBuyTreeList(id) {
    let currentTree = treeData[id];
    let treeOption = document.createElement("DIV");
    treeOption.classList.add("treeOption");
    treeOption.dataset.id = id;
    treeOption.setAttribute("onclick", "buyTree(this)")
    treeOption.innerHTML = `
        <img src="src/trees/${currentTree.name}.png" class="treeIcon" alt="${currentTree.name} Tree Icon">
        <p class="treeName">${currentTree.name.charAt(0).toUpperCase() + currentTree.name.slice(1)}</p>
        <p class="treePrice">${currentTree.price}</p>
    `;
    buyTreeList.appendChild(treeOption)
}

function buyTree(treeElement) {
    let currentTree = treeData[treeElement.dataset.id];
    if (currentTree.price <= oxygen) {
        changeOxygen(currentTree.price * -1)
        addTree(currentTree.id)
        currentTree.amount += 1
        sellTreeList.children[currentTree.id].children[2].innerText = currentTree.amount
        currentTree.price = Math.round(currentTree.price * treePriceMultiplier)
        treeElement.lastElementChild.innerText = currentTree.price;
    }
    else {
        treeElement.lastElementChild.style.color = "red";
        setTimeout(() => {
            treeElement.lastElementChild.removeAttribute("style") // Remove red color
        }, 500);
    }
}

// SELL TREE FUNCTIONS
function menuAppendSellTreeList(id) {
    let currentTree = treeData[id];
    let treeOption = document.createElement("DIV");
    treeOption.classList.add("treeOption");
    treeOption.dataset.id = id;
    treeOption.setAttribute("onclick", "sellTree(this)")
    treeOption.innerHTML = `
        <img src="src/trees/${currentTree.name}.png" class="treeIcon" alt="${currentTree.name} Tree Icon">
        <p class="treeName">${currentTree.name.charAt(0).toUpperCase() + currentTree.name.slice(1)}</p>
        <p class="treeAmount">${currentTree.amount}</p>
    `;
    sellTreeList.appendChild(treeOption)
}

function sellTree(treeElement) {
    let currentTree = treeData[treeElement.dataset.id];
    if (currentTree.amount > 0) {
        // Can sell tree
        let targetTree = (function () {
            for (let y = 0; y < forestTiles.length; y++) {
                for (let x = 0; x < forestTiles[y].length; x++) {
                    if (forestTiles[y][x].id == currentTree.id) {
                        return forestTiles[y][x];
                    }
                }
            }
        })();
        forestTiles[targetTree.y][targetTree.x] = "X"
        currentTree.amount -= 1
        changeOxygen(currentTree.sell)
        currentTree.sell = Math.round(currentTree.sell * treePriceMultiplier)
        treeElement.lastElementChild.innerText = currentTree.amount;

        ctx.fillStyle = "green";
        ctx.fillRect(targetTree.x * tileSize + xAnchor, targetTree.y * tileSize + yAnchor, tileSize, tileSize);
    }
    else {
        treeElement.lastElementChild.style.color = "red";
        setTimeout(() => {
            treeElement.lastElementChild.removeAttribute("style") // Remove red color
        }, 500);
    }
}

// INVESTING FUNCTIONS
function displayNewInvestor() {
    let demandFactor = Math.ceil(Math.floor(Math.random() * (10 - 1 + 1) + 1) * 0.5);
    let previousName = currentInvestor.name;
    currentInvestor = {
        "name": investorList[getRandom(0, investorList.length - 1)],
        "demand": (oxygen / demandFactor) - ((oxygen / demandFactor) % 50),
        "volatility": getRandom(5, 50) / 100,
        "time": getRandom(15, 90)
    }
    while (currentInvestor.name == previousName) {
        currentInvestor.name = investorList[getRandom(0, investorList.length - 1)];
    }
    if (currentInvestor.demand <= 0) {
        currentInvestor.demand = 10
    }
    investorName.innerText = currentInvestor.name;
    investorDemand.innerText = currentInvestor.demand;
    investorVolatility.innerText = Math.round(currentInvestor.volatility * 100);
    investorTimePeriod.innerText = currentInvestor.time;
}

displayNewInvestor()

function acceptInvestor() {
    investorActions.style.display = "none";
    investorWait.style.display = "block";
    let waitCountdown = currentInvestor.time;
    investorWait.innerText = `Time Left: ${waitCountdown} sec`;

    counterInterval = setInterval(() => {
        waitCountdown -= 1;
        investorWait.innerText = `Time Left: ${waitCountdown} sec`;
        if (waitCountdown <= 0) {
            let profit = Math.round((currentInvestor.volatility * currentInvestor.demand) * (getRandom(0, 1) ? -1 : 1))
            changeOxygen(profit)

            investmentBanner.innerText = "Investment Profit: " + profit;
            investmentBanner.classList.add("bannerAnimation")
            investmentBanner.onanimationend = () => {
                investmentBanner.classList.remove("bannerAnimation")
            }

            investorActions.style.display = "block";
            investorWait.style.display = "none";
            displayNewInvestor()
            clearInterval(counterInterval)
        };

    }, 1000)
}

// MAIN GAME LOOP
function gameLoop() {
    if (lastLoopIter + 1000 <= Date.now()) { // one sec delay
        let production = 0
        for (let x = 0; x < treeData.length; x++) {
            changeOxygen(treeData[x].production * treeData[x].amount);
            production += treeData[x].production * treeData[x].amount;
        }
        lastLoopIter = Date.now()
        statsProductionCounter.innerText = production
        playTime += 1
        statsPlayTime.innerText = formatTime(playTime)
    
        checkForAchievement()
        if (isSaving) {
            localStorage.setItem("saveData", utf8_to_b64(JSON.stringify(generateSaveData())))
        }
    }

    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)

document.body.onload = () => {
    isSaving = true;
    if (localStorage.getItem("saveData") != null) {
        loadFromSaveData(localStorage.getItem("saveData"))
    }
}

// ACHIVEMENTS
fetch("achievements.json").then(
    function(response){ return response.json();}
).then(
    function(json){
        achievementData = json;
        statsTotalAchievements.innerText = achievementData.length;
    }
).then(
    function() {
        menuAppendAchievementList();
    }
)

function menuAppendAchievementList() {
    achievementData.forEach(element => {
        let achievementCard = document.createElement("achievementCard");
        achievementCard.classList.add("achievementCard");
        achievementCard.innerHTML = `
            <img src="src/ui/question.png" alt="question" class="achievementStatus">
            <div class="achievementText">
                <h6>${element.name}</h6>
                <p>${element.desc}</p>
            </div>
        `;
        achievementList.appendChild(achievementCard);
    });
}

function broadcastAchivement(content) {
    let achievementBanner = document.createElement("div");
    achievementBanner.innerText = content;
    achievementBanner.classList.add("achivementBanner");
    achievementBanner.classList.add("achievementBannerAnimation");
    achievementBanner.onanimationend = () => {
        achievementBanner.remove()
    }
    document.body.appendChild(achievementBanner)
}

function grantAchievement(id) {
    aquiredAchievement.push(id);
    statsAchievementCounter.innerText = aquiredAchievement.length;
    achievementList.children[id].children[0].src = "src/ui/trophy.png"
    broadcastAchivement(achievementData[id].name);
}

function checkForAchievement() {
    if (!aquiredAchievement.includes(0) && treeCounter >= 1) {
        grantAchievement(0)
    }
    else if (!aquiredAchievement.includes(1) && treeCounter >= 10) {
        grantAchievement(1)
    }
    else if (!aquiredAchievement.includes(2) && treeCounter >= 50) {
        grantAchievement(2)
    }
    else if (!aquiredAchievement.includes(3) && treeCounter >= 100) {
        grantAchievement(3)
    }
    else if (!aquiredAchievement.includes(4) && treeCounter >= 500) {
        grantAchievement(4)
    }
    else if (!aquiredAchievement.includes(5) && treeCounter >= 1000) {
        grantAchievement(5)
    }
    else if (!aquiredAchievement.includes(6) && treeCounter >= 5000) {
        grantAchievement(6)
    }
    else if (!aquiredAchievement.includes(7) && treeCounter >= 10000) {
        grantAchievement(7)
    }
    else if (!aquiredAchievement.includes(8) && treeCounter >= 50000) {
        grantAchievement(8)
    }
    else if (!aquiredAchievement.includes(9) && treeCounter >= 100000) {
        grantAchievement(9)
    }
    else if (!aquiredAchievement.includes(10) && treeCounter >= 500000) {
        grantAchievement(10)
    }
    else if (!aquiredAchievement.includes(11) && treeCounter >= 1000000) {
        grantAchievement(11)
    }
    else if (!aquiredAchievement.includes(12) && treeCounter >= 10000000) {
        grantAchievement(12)
    }
    else if (!aquiredAchievement.includes(13) && treeCounter >= 100000000) {
        grantAchievement(13)
    }
    else if (!aquiredAchievement.includes(14) && treeCounter >= 1000000000) {
        grantAchievement(14)
    }

    else if (
        !aquiredAchievement.includes(15) && 
        treeData[0].amount >= 1 &&
        treeData[1].amount >= 1 &&
        treeData[2].amount >= 1 &&
        treeData[3].amount >= 1 &&
        treeData[4].amount >= 1 &&
        treeData[4].amount >= 1 &&
        treeData[5].amount >= 1 &&
        treeData[5].amount >= 1 &&
        treeData[6].amount >= 1 && 
        treeData[7].amount >= 1 &&
        treeData[8].amount >= 1 &&
        treeData[9].amount >= 1) {
        grantAchievement(15)
    }

    else if (
        !aquiredAchievement.includes(16) && 
        treeData[0].amount >= 10 &&
        treeData[1].amount >= 10 &&
        treeData[2].amount >= 10 &&
        treeData[3].amount >= 10 &&
        treeData[4].amount >= 10 &&
        treeData[4].amount >= 10 &&
        treeData[5].amount >= 10 &&
        treeData[5].amount >= 10 &&
        treeData[6].amount >= 10 && 
        treeData[7].amount >= 10 &&
        treeData[8].amount >= 10 &&
        treeData[9].amount >= 10) {
        grantAchievement(16)
    }
    else if (
        !aquiredAchievement.includes(17) && 
        treeData[0].amount >= 100 &&
        treeData[1].amount >= 100 &&
        treeData[2].amount >= 100 &&
        treeData[3].amount >= 100 &&
        treeData[4].amount >= 100 &&
        treeData[4].amount >= 100 &&
        treeData[5].amount >= 100 &&
        treeData[5].amount >= 100 &&
        treeData[6].amount >= 100 && 
        treeData[7].amount >= 100 &&
        treeData[8].amount >= 100 &&
        treeData[9].amount >= 100) {
        grantAchievement(17)
    }
    else if (
        !aquiredAchievement.includes(18) && 
        treeData[0].amount >= 1000 &&
        treeData[1].amount >= 1000 &&
        treeData[2].amount >= 1000 &&
        treeData[3].amount >= 1000 &&
        treeData[4].amount >= 1000 &&
        treeData[4].amount >= 1000 &&
        treeData[5].amount >= 1000 &&
        treeData[5].amount >= 1000 &&
        treeData[6].amount >= 1000 && 
        treeData[7].amount >= 1000 &&
        treeData[8].amount >= 1000 &&
        treeData[9].amount >= 1000) {
        grantAchievement(18)
    }
    else if (
        !aquiredAchievement.includes(19) && 
        treeData[0].amount >= 10000 &&
        treeData[1].amount >= 10000 &&
        treeData[2].amount >= 10000 &&
        treeData[3].amount >= 10000 &&
        treeData[4].amount >= 10000 &&
        treeData[4].amount >= 10000 &&
        treeData[5].amount >= 10000 &&
        treeData[5].amount >= 10000 &&
        treeData[6].amount >= 10000 && 
        treeData[7].amount >= 10000 &&
        treeData[8].amount >= 10000 &&
        treeData[9].amount >= 10000) {
        grantAchievement(19)
    }
    else if (
        !aquiredAchievement.includes(20) && 
        treeData[0].amount >= 100000 &&
        treeData[1].amount >= 100000 &&
        treeData[2].amount >= 100000 &&
        treeData[3].amount >= 100000 &&
        treeData[4].amount >= 100000 &&
        treeData[4].amount >= 100000 &&
        treeData[5].amount >= 100000 &&
        treeData[5].amount >= 100000 &&
        treeData[6].amount >= 100000 && 
        treeData[7].amount >= 100000 &&
        treeData[8].amount >= 100000 &&
        treeData[9].amount >= 100000) {
        grantAchievement(20)
    }
    else if (
        !aquiredAchievement.includes(21) && 
        treeData[0].amount >= 1000000 &&
        treeData[1].amount >= 1000000 &&
        treeData[2].amount >= 1000000 &&
        treeData[3].amount >= 1000000 &&
        treeData[4].amount >= 1000000 &&
        treeData[4].amount >= 1000000 &&
        treeData[5].amount >= 1000000 &&
        treeData[5].amount >= 1000000 &&
        treeData[6].amount >= 1000000 && 
        treeData[7].amount >= 1000000 &&
        treeData[8].amount >= 1000000 &&
        treeData[9].amount >= 1000000) {
        grantAchievement(21)
    }

    else if (
        !aquiredAchievement.includes(22) && 
        treeData[0].amount >= 1 &&
        treeData[1].amount >= 1 &&
        treeData[2].amount >= 1) {
        grantAchievement(22)
    }
    else if (
        !aquiredAchievement.includes(23) && 
        treeData[0].amount >= 100 &&
        treeData[1].amount >= 100 &&
        treeData[2].amount >= 100) {
        grantAchievement(23)
    }
    else if (
        !aquiredAchievement.includes(24) && 
        treeData[0].amount >= 1000 &&
        treeData[1].amount >= 1000 &&
        treeData[2].amount >= 1000) {
        grantAchievement(24)
    }

    else if (
        !aquiredAchievement.includes(25) && 
        treeData[3].amount >= 1 &&
        treeData[4].amount >= 1 &&
        treeData[8].amount >= 1) {
        grantAchievement(25)
    }
    else if (
        !aquiredAchievement.includes(26) && 
        treeData[3].amount >= 100 &&
        treeData[4].amount >= 100 &&
        treeData[8].amount >= 100) {
        grantAchievement(26)
    }
    else if (
        !aquiredAchievement.includes(27) && 
        treeData[3].amount >= 1000 &&
        treeData[4].amount >= 1000 &&
        treeData[8].amount >= 1000) {
        grantAchievement(27)
    }

    else if (
        !aquiredAchievement.includes(28) && 
        treeData[5].amount >= 1 &&
        treeData[6].amount >= 1 &&
        treeData[7].amount >= 1) {
        grantAchievement(28)
    }
    else if (
        !aquiredAchievement.includes(29) && 
        treeData[5].amount >= 100 &&
        treeData[6].amount >= 100 &&
        treeData[7].amount >= 100) {
        grantAchievement(29)
    }
    else if (
        !aquiredAchievement.includes(30) && 
        treeData[5].amount >= 1000 &&
        treeData[6].amount >= 1000 &&
        treeData[7].amount >= 1000) {
        grantAchievement(30)
    }

    else if (!aquiredAchievement.includes(31) && treeData[9].amount >= 1) {
        grantAchievement(31)
    }
    else if (!aquiredAchievement.includes(32) && treeData[9].amount >= 100) {
        grantAchievement(32)
    }
    else if (!aquiredAchievement.includes(33) && treeData[9].amount >= 1000) {
        grantAchievement(33)
    }
}

// STATS
// All embeded in commands
function formatTime(time) {
    let remainingTime = time
    let result = "";

    result += `${Math.floor(remainingTime / 3600)}h `
    remainingTime -= Math.floor(remainingTime / 3600) * 3600

    result += `${Math.floor(remainingTime / 60)}m `
    remainingTime -= Math.floor(remainingTime / 60) * 60

    result += `${remainingTime}s`
    
    return result;
}

// SAVE
function generateSaveData() {
    return {
        "oxygen": oxygen,
        "forestTiles": forestTiles,
        "treeData": treeData,
        "aquiredAchievement": aquiredAchievement,
        "playTime": playTime // The rest of the stats can be calculated
    }
}

function displaySaveData() {
    saveDataDisplay.value = utf8_to_b64(JSON.stringify(generateSaveData()))
}

function copySaveData() {
    navigator.clipboard.writeText(saveDataDisplay.value);
    document.querySelector(".saveCopyIcon").src = "src/ui/clipboardCheck.svg";
    setTimeout(() => {
        document.querySelector(".saveCopyIcon").src = "src/ui/clipboard.svg";
    }, 1000)
}

function loadFromSaveData(saveData) {
    if (saveData.length == 0) {return null}
    let json = JSON.parse(b64_to_utf8(saveData.trim()))
    // Stats
    setOxygen(json.oxygen); // Oxygen
    treeData = json.treeData; // Tree Data
    sellTreeList.innerHTML = "";
    buyTreeList.innerHTML = "";
    forestTiles = json.forestTiles; // Forest tiles
    loadImage()
    setTimeout(() => { // Give time for the images to load
        for (let x = 0; x < json.aquiredAchievement.length; x++) { // Achievement
            let id = json.aquiredAchievement[x];
            aquiredAchievement.push(id);
            statsAchievementCounter.innerText = aquiredAchievement.length;
            achievementList.children[id].children[0].src = "src/ui/trophy.png"
        }
        redrawForest()
        treeCounter = 0;
        for (let x = 0; x < treeData.length; x++) {
            sellTreeList.children[x].children[2].innerText = treeData[x].amount; // Sell amount
            buyTreeList.children[x].children[2].innerText = treeData[x].price; // Buy price
            treeCounter += treeData[x].amount;
        }
        statsTreeCounter.innerText = treeCounter;
        playTime = json.playTime
        statsPlayTime.innerText = formatTime(json.playTime);
    }, 50)

}

function utf8_to_b64(str) {
    return btoa(str)
}

function b64_to_utf8(str) {
    return atob(str)
}

function clearData() {
    if (confirm("Do you want to clear all progress?")) {
        isSaving = false
        localStorage.setItem("saveData", "");
        window.location.reload()
    }
}
