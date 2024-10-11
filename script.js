
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
const timeLeft = document.getElementById('timer');
let questions;
let game;

// Result
const resultDiv = document.querySelector('.result');
const resultList = document.getElementById('result-list');



categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        category = button.value;
        categoryButtons.forEach(button => {
            button.style.backgroundColor = 'white';
        })
        button.style.backgroundColor = 'lightgreen';
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
    gameDiv.classList.toggle('show');
    createPlayers();
    startGame();
})






class Game {
    constructor(questions, players) {
        this.questions = questions;
        this.players = players;
        this.counter = 0;
        this.currentPlayer = 0;
        this.gameOver = false;
        this.timer = null;
        this.timeLimit = 15000;
    
    }

    loadNewQuestion() {
        if (this.counter < this.questions.results.length) {
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
            
            this.startTimer();
        } else {
            this.showResults();
            this.gameOver = true;
            console.log('GAME OVER')
        }



    }

    startTimer() {
        if(this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            console.log('Time is up!');
            this.changePlayer(); // Byt spelare om tiden går ut
            this.disableOptions();
        }, this.timeLimit);
    }

    checkIfCorrect(selected) {
        if (selected.value === 'true') {
            selected.style.backgroundColor = 'lightgreen';
            this.givePoint();
            this.changePlayer();
        } else {
            selected.style.backgroundColor = 'red';
            optionButtons.forEach(option => {
                if (option.value === 'true') {
                    option.style.backgroundColor = 'lightgreen';
                }
            })
            console.log(this.players[this.currentPlayer].name);
            console.log(this.players[this.currentPlayer].score);
            console.log(this.counter);
            this.changePlayer();

        }
    }

    disableOptions() {
        optionButtons.forEach(button => {
            button.disabled = true
        })
    }

    changePlayer() {
        if (this.currentPlayer < this.players.length - 1) {
            this.currentPlayer++;
        } else {
            this.currentPlayer = 0;
        }
    }

    givePoint() {
        this.players[this.currentPlayer].score++;
        console.log(this.players[this.currentPlayer].name);
        console.log(this.players[this.currentPlayer].score);
        console.log(this.counter);
    }

    showResults() {
        console.log('inside showresults')
        game.players.sort((a,b) => b.score - a.score);
        game.players.forEach(player => {
            const listItem = document.createElement('li');
            const name = document.createElement('p');
            name.textContent = player.name
            const score = document.createElement('p');
            score.textContent = `${player.score}/${game.questions.results.length}`;
            listItem.appendChild(name)
            listItem.appendChild(score)

            resultList.appendChild(listItem);
        })
    }


}

optionButtons.forEach(selected => {
    selected.addEventListener('click', () => {
        game.checkIfCorrect(selected);
        game.disableOptions();
        // optionButtons.forEach(button => {
        //     button.disabled = true;
        // })
    });
})

nextQuestionBtn.addEventListener('click', () => {
    if(!game.gameOver) {
        game.counter++;
        resetOptionColors();
        game.loadNewQuestion();
        optionButtons.forEach(button => {
            button.disabled = false;
        })
    } else {
        gameDiv.classList.toggle('show');
        resultDiv.classList.toggle('show');
    }
});

function resetOptionColors() {
    optionButtons.forEach(option => {
        option.style.backgroundColor = 'white';
    })
}

function showResults() {
    console.log('RESULTS')

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




