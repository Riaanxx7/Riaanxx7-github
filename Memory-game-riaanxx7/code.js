let my_puzzle;
let currentPlayer;
let score = { 1: 0, 2: 0 }; 
let clickedTiles = [];
let allowClick = true;
let totalPairs;
let foundPairs = 0;  
let currentLevelType;

// Functie om het voorbeeldlevel-scherm te openen
function VLscherm() { 
    document.getElementById("start_screen").style.display = "none";
    document.getElementById("Levels").style.display = "block";
}

// spelbord laden o.b.v. geselecteerde grootte 
function loadPuzzle(size) {
    currentLevelType = size; 
    clickedTiles = []; 
    foundPairs = 0; 
    score[1] = 0; 
    score[2] = 0; 
    currentPlayer = Math.floor(Math.random() * 2) + 1; // 
    alert(`Speler ${currentPlayer} begint!`);
    updateScore(); 

    // voorbeeldlevels
    if (size === 'level1') {
        my_puzzle = [
            ["A", "B", "C"],
            ["B", "C", "A"]
        ];
        totalPairs = 3;
        document.getElementById("teller1_2x3").style.display = "block";
        document.getElementById("teller2_2x3").style.display = "block";
    } else if (size === 'level2') {
        my_puzzle = [
            ["A", "B", "C", "C"],
            ["B", "D", "A", "E"],
            ["E", "F", "F", "D"]
        ];
        totalPairs = 6;
        document.getElementById("teller1_3x4").style.display = "block";
        document.getElementById("teller2_3x4").style.display = "block";
    } else if (size === 'level3') {
        my_puzzle = [
            ["A", "B", "C", "C", "G"],
            ["B", "D", "A", "E", "H"],
            ["E", "F", "F", "D", "H"],
            ["I", "J", "G", "I", "J"]
        ];
        totalPairs = 10;
        document.getElementById("teller1_4x5").style.display = "block";
        document.getElementById("teller2_4x5").style.display = "block";

    // randomlevels d.m.v een willekeurige puzzle generator (zie functie onderaan)
    } else if (size === '2x3') {
        my_puzzle = generateRandomPuzzle(2, 3); 
        totalPairs = 3;
        document.getElementById("teller1_2x3").style.display = "block";
        document.getElementById("teller2_2x3").style.display = "block";
    } else if (size === '3x4') {
        my_puzzle = generateRandomPuzzle(3, 4);
        totalPairs = 6;
        document.getElementById("teller1_3x4").style.display = "block";
        document.getElementById("teller2_3x4").style.display = "block";
    } else if (size === '4x5') {
        my_puzzle = generateRandomPuzzle(4, 5);
        totalPairs = 10;
        document.getElementById("teller1_4x5").style.display = "block";
        document.getElementById("teller2_4x5").style.display = "block";
    }

    document.getElementById("start_screen").style.display = "none";
    document.getElementById("Levels").style.display = "none";
    draw_puzzle(my_puzzle);
}


function resetGame() {
    score = { 1: 0, 2: 0 }; 
    foundPairs = 0; 
    clickedTiles = [];  
    currentPlayer = Math.floor(Math.random() * 2) + 1; 
    alert(`Speler ${currentPlayer} begint!`);
    updateScore(); 
    loadPuzzle(currentLevelType);
}

// genereer een willekeurige puzzel 
function generateRandomPuzzle(rows, cols) {
    const totalCells = rows * cols;
    const letters = [];

    // Voeg letters in paren toe
    for (let i = 0; i < totalCells / 2; i++) {
        const letter = String.fromCharCode(65 + i); 
        letters.push(letter, letter);
    }

    // Schud de letters willekeurig
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    // puzzel maken o.b.v. geschudde letters
    const puzzle = [];
    for (let i = 0; i < rows; i++) {
        puzzle[i] = letters.slice(i * cols, (i + 1) * cols);
    }
    return puzzle;
}

// herbruikt van sliding-puzzle-opgave
function draw_puzzle(puzzle) {
    let puzzle_html = generate_puzzle_html(puzzle);
    document.getElementById("puzzle_container").innerHTML = puzzle_html;
}

// herbruikt van sliding-puzzle-opgave + deels aangepast 
function generate_puzzle_html(puzzle) {
    let puzzle_inner_html = "";
    for (let i = 0; i < puzzle.length; i++) {
        let row_html = "<tr>";
        for (let j = 0; j < puzzle[i].length; j++) {
            row_html += `
                <td onclick="PuzzleGame(${i}, ${j})">
                    <span class="hiddenText">${puzzle[i][j]}</span>
                </td>`;
        }
        row_html += "</tr>";
        puzzle_inner_html += row_html;
    }
    return `<table>${puzzle_inner_html}</table>`;
}

// het 'werkend spel' => interactie met de tegels 
function PuzzleGame(row, col) {
    if (!allowClick) return; 

    const td = document.querySelector(`tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
    const span = td.querySelector('span');

    const key = `${row}-${col}`;
    if (clickedTiles.includes(key)) return; // voorkom 2 kliks op éénzelfde tegel

    clickedTiles.push(key);
    span.classList.remove('hiddenText');

    // controleert of 2 geklikte tegels inhoudelijk overeenkomen 
    if (clickedTiles.length === 2) {
        allowClick = false; 
        const [firstKey, secondKey] = clickedTiles;
        const [firstRow, firstCol] = firstKey.split('-').map(Number);      // Haal de rij- en kolomindexen uit de 'clickedTiles' 
        const [secondRow, secondCol] = secondKey.split('-').map(Number);   

        // Zoek de <span> elementen die bij de geklikte tegels horen in het spelbord 
        const firstTile = document.querySelector(`tr:nth-child(${firstRow + 1}) td:nth-child(${firstCol + 1}) span`);
        const secondTile = document.querySelector(`tr:nth-child(${secondRow + 1}) td:nth-child(${secondCol + 1}) span`);

        if (my_puzzle[firstRow][firstCol] === my_puzzle[secondRow][secondCol]) {
            score[currentPlayer]++;
            foundPairs++;
            updateScore();

            if (foundPairs === totalPairs) {
                declareWinner(); 
            }

            clickedTiles = [];
            allowClick = true;
        } else {
            setTimeout(() => {
                if (firstTile) firstTile.classList.add('hiddenText');
                if (secondTile) secondTile.classList.add('hiddenText');
                clickedTiles = [];
                currentPlayer = currentPlayer === 1 ? 2 : 1; 
                alert(`Het is nu de beurt van speler ${currentPlayer}`);
                allowClick = true;
            }, 800);
        }
    }
}

// scores bijwerken
function updateScore() {
    document.getElementById("teller1_2x3").textContent = score[1];
    document.getElementById("teller2_2x3").textContent = score[2];
    document.getElementById("teller1_3x4").textContent = score[1];
    document.getElementById("teller2_3x4").textContent = score[2];
    document.getElementById("teller1_4x5").textContent = score[1];
    document.getElementById("teller2_4x5").textContent = score[2];
}

// Winnaar bekend maken 
function declareWinner() {
    if (score[1] > score[2]) {
        alert("Speler 1 heeft gewonnen!");
    } else if (score[2] > score[1]) {
        alert("Speler 2 heeft gewonnen!");
    } else {
        alert("Het is een gelijkspel!");
    }

    // herstartknop afhankelijk van het leveltype
    if (currentLevelType === 'level1') {
        document.getElementById("restartlevel1").style.display = "block";
    } else if (currentLevelType === 'level2') {
        document.getElementById("restartlevel2").style.display = "block";
    } else if (currentLevelType === 'level3') {
        document.getElementById("restartlevel3").style.display = "block";
    } else if (currentLevelType === '2x3') {
        document.getElementById("restart_random_2x3").style.display = "block";
    } else if (currentLevelType === '3x4') {
        document.getElementById("restart_random_3x4").style.display = "block";
    } else if (currentLevelType === '4x5') {
        document.getElementById("restart_random_4x5").style.display = "block";
    }
}
