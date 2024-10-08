
// Intro
const introDiv = document.querySelector('.intro');
let category = "";
const categoryButtons = document.querySelectorAll('.category-buttons');
const introContinueButton = document.getElementById('intro-continue-button');
const subtractPlayers = document.getElementById('subtract');
const addPlayers = document.getElementById('add');
const amountPlayersInput = document.getElementById('players-amount');
let amountOfPlayers = 0;


// Names
const namesDiv = document.querySelector('.names');
const startGameButton = document.getElementById('start-game');


// Game
const gameDiv = document.querySelector('.game');
const question = document.getElementById('question');
const questionCategory = document.getElementById('category');
const optionButtons = document.querySelectorAll('.option');
const nextQuestionBtn = document.getElementById('next-question');
let questions;
let game;

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        category = button.value;

        button.style.backgroundColor = 'green';
    })
})

subtractPlayers.addEventListener('click', () => {
    if (amountOfPlayers > 1) {
        amountOfPlayers--;
        amountPlayersInput.value = amountOfPlayers;
    }
})
addPlayers.addEventListener('click', () => {
    if (amountOfPlayers < 10) {
        amountOfPlayers++;
        amountPlayersInput.value = amountOfPlayers;
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






class Game {
    constructor(questions, players) {
        this.questions = questions;
        this.players = players;
        this.counter = 0;
        this.currentPlayer = 0;


    }

    loadNewQuestion() {
        this.answers = [
            {
                answer: this.questions.results[this.counter].correct_answer,
                isCorrect: true
            },
            {
                answer: this.questions.results[this.counter].incorrect_answers[0],
                isCorrect: false
            },
            {
                answer: this.questions.results[this.counter].incorrect_answers[1],
                isCorrect: false
            },
            {
                answer: this.questions.results[this.counter].incorrect_answers[2],
                isCorrect: false
            },
        ]

        questionCategory.textContent = this.questions.results[this.counter].category;
        question.textContent = this.questions.results[this.counter].question;
        for (let i = 0; i < 4; i++) {
            optionButtons[i].value = this.answers[i].isCorrect;
            optionButtons[i].textContent = this.answers[i].answer;
        }

        this.counter++;
    }

    checkIfCorrect(selected) {
        if (selected.value === 'true') {
            selected.style.backgroundColor = 'green';
            this.givePoint();
            this.changePlayer();
        } else {
            selected.style.backgroundColor = 'red';
            optionButtons.forEach(option => {
                if (option.value === 'true') {
                    option.style.backgroundColor = 'green';
                }
            })
            console.log(this.players[this.currentPlayer].name);
            console.log(this.players[this.currentPlayer].score);
            this.changePlayer();
            
        }
    }
    
    changePlayer() {
        if (this.currentPlayer < this.players.length - 1) {
            this.currentPlayer++;
        } else {
            this.currentPlayer = 0;
        }
    }

    givePoint() {
        this.players[this.currentPlayer].score ++;
            console.log(this.players[this.currentPlayer].name);
            console.log(this.players[this.currentPlayer].score);
    }


}

optionButtons.forEach(selected => {
    selected.addEventListener('click', () => {
        game.checkIfCorrect(selected);
    });
})

nextQuestionBtn.addEventListener('click', () => {
    resetOptionColors();
    game.loadNewQuestion();
});

function resetOptionColors() {
    optionButtons.forEach(option => {
        option.style.backgroundColor = 'white';
    })
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
    for (let i = 0; i < amountOfPlayers; i++) {
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
    const players = [];
    for (let i = 0; i < amountOfPlayers; i++) {
        const player = new Player(document.querySelectorAll('.name-input')[i].value, i + 1);
        players.push(player);
    }

    createGame(players);


}

function createGame(players) {
    game = new Game(questions, players);
}

function startGame() {
    game.loadNewQuestion();


}




