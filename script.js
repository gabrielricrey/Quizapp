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
const introDiv = document.querySelector('.intro');
const categoryButtons = document.querySelectorAll('.category-buttons');
const introContinueButton = document.getElementById('intro-continue-button');
const namesDiv = document.querySelector('.names');
const subtractPlayers = document.getElementById('subtract');
const amountPlayersInput = document.getElementById('players-amount');
const addPlayers = document.getElementById('add');
const startGameButton = document.getElementById('start-game');
let questions;
const gameDiv = document.querySelector('.game');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        category = button.value;

        button.style.backgroundColor = 'green';
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
    introDiv.classList.toggle('hidden');
    namesDiv.classList.toggle('show');
    getQuestions(category);
    makeNameInputs();

})

startGameButton.addEventListener('click', () => {
    namesDiv.classList.toggle('show');
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
        namesDiv.prepend(nameInput);
    }
    createHeader()
}

function createHeader() {
    const h2 = document.createElement('h2');
    h2.innerText = 'Enter player names';
    namesDiv.prepend(h2);
}

function createPlayers() {
    for (let i = 0; i < app.amountOfPlayers; i++) {
        const player = new Player(document.querySelectorAll('.name-input')[i].value, i + 1);
        app.players.push(player);
    }
    console.log(app.players);
}

function startGame() {
    createElementsAndloadNewQuestion();


}

    let counter = 0;
function createElementsAndloadNewQuestion() {
    let answers = [
        {
            answer: questions.results[counter].correct_answer,
            isCorrect: true
        },
        {
            answer: questions.results[counter].incorrect_answers[0],
            isCorrect: false
        },
        {
            answer: questions.results[counter].incorrect_answers[1],
            isCorrect: false
        },
        {
            answer: questions.results[counter].incorrect_answers[2],
            isCorrect: false
        },
    ]

    gameDiv.innerHTML = "";
    const category = document.createElement('h2');
    category.textContent = questions.results[counter].category;
    const question = document.createElement('h3');
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    for (let i = 0; i < 4; i++) {
        const optionButton = document.createElement('button');
        optionButton.className = "option";
        optionButton.value = answers[i].isCorrect;
        optionButton.textContent = answers[i].answer;
        optionsDiv.appendChild(optionButton);
    }
    const nextQuestionBtn = document.createElement('button');
    nextQuestionBtn.className = 'next-question';


    question.textContent = questions.results[counter].question;

    gameDiv.appendChild(category);
    gameDiv.appendChild(question);
    gameDiv.appendChild(optionsDiv);
    gameDiv.appendChild(nextQuestionBtn);
    counter ++;
    nextQuestionBtn.addEventListener('click', startGame);




}




