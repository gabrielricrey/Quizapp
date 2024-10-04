const app = {
    players: [],
    amountOfPlayers: 0,

}

class Player {
    constructor(name, id) {
        this.name = name;
        this.score = 0;
        this.id = id;
    }

    addScore() {
        this.score++;
    }

    resetScore() {
        this.score = 0
    }
}

let category = "";
const categoryButtons = document.querySelectorAll('.category-buttons');
const introContinueButton = document.getElementById('intro-continue-button');
const namesDiv = document.querySelector('.names');
const subtractPlayers = document.getElementById('subtract')
const amountPlayersInput = document.getElementById('players-amount');
const addPlayers = document.getElementById('add')
const startGameButton = document.getElementById('start-game');
let questions;
const gameDiv = document.querySelector('.game');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        category = button.value;
        console.log(category);
    })
})

subtractPlayers.addEventListener('click', () => {
    if (app.amountOfPlayers > 1) {
        app.amountOfPlayers--;
        amountPlayersInput.value = app.amountOfPlayers;
        console.log(app.amountOfPlayers);
    }
})
addPlayers.addEventListener('click', () => {
    if (app.amountOfPlayers < 10) {
        app.amountOfPlayers++;
        amountPlayersInput.value = app.amountOfPlayers;
        console.log(app.amountOfPlayers);
    }
})

introContinueButton.addEventListener('click', () => {
    getQuestions(category);
    makeNameInputs();

})

startGameButton.addEventListener('click', () => {
    createPlayers();
    startGame();
})

async function getQuestions(category) {
    let response;

    switch (category) {
        case 'sports':
            response = await fetch('https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple');
            questions = await response.json();
            console.log(questions.results);
            break;
        case 'history':
            response = await fetch('https://opentdb.com/api.php?amount=10&category=23&difficulty=medium&type=multiple');
            questions = await response.json();
            console.log(questions.results);
            break;
        case 'movies':
            response = await fetch('https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple');
            questions = await response.json();
            console.log(questions.results);
            break;
        case 'animals':
            response = await fetch('https://opentdb.com/api.php?amount=10&category=27&difficulty=medium&type=multiple');
            questions = await response.json();
            console.log(questions.results);
            break;
        case 'mix':

            // fixa senare! 

            response = await fetch('');
            questions = await response.json();
            console.log(questions);
            break;


    }
}

function makeNameInputs() {
    for (let i = 0; i < app.amountOfPlayers; i++) {
        const nameInput = document.createElement('input');
        nameInput.className = "name-input";
        namesDiv.appendChild(nameInput);
    }
}

function createPlayers() {
    for (let i = 0; i < app.amountOfPlayers; i++) {
        const player = new Player(document.querySelectorAll('.name-input')[i].value, i + 1);
        app.players.push(player);
    }
    console.log(app.players);
}

function startGame() {
        const contentDiv = document.createElement('div');
        const question = document.createElement('h3');
        const optionsDiv = document.createElement('div');
        for(let i = 0; i < 4; i++) {
            const optionButton = document.createElement('button');
            optionButton.className = "option";
            optionsDiv.appendChild(optionButton);
        }
        const nextQuestionBtn = document.createElement('button');
        nextQuestionBtn.className = 'next-question';

        
        question.textContent = questions.results[0].question;

        contentDiv.appendChild(question);
        contentDiv.appendChild(optionsDiv);
        contentDiv.appendChild(nextQuestionBtn);
        console.log(contentDiv);
        gameDiv.appendChild(contentDiv);

        nextQuestionBtn.addEventListener('click', loadNewQuestion);

}




