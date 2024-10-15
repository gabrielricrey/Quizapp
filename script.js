
// Intro
const introDiv = document.querySelector('.intro');
let category = "";
let difficulty = "";
const radioButtons = document.querySelectorAll('.radio-btns')
const categoryButtons = document.querySelectorAll('.category-buttons');
const introContinueButton = document.getElementById('intro-continue-button');
const subtractPlayers = document.getElementById('subtract');
const addPlayers = document.getElementById('add');
const amountPlayersInput = document.getElementById('players-amount');
let amountOfPlayers = 0;


// Names
const namesDiv = document.querySelector('.names');
const namesInputDiv = document.querySelector('.names-div');
const startGameButton = document.getElementById('start-game');


// Game
const gameDiv = document.querySelector('.game');
const question = document.getElementById('question');
const optionButtons = document.querySelectorAll('.option');
const nextQuestionBtn = document.querySelector('.next-question');
const player = document.getElementById('current-player');
const questionCounter = document.getElementById('question-counter');
let questions;
let game;

// Result
const resultDiv = document.querySelector('.result');
const resultList = document.getElementById('result-list');

class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    addScore() {
        this.score++;
    }

    resetScore() {
        this.score = 0
    }
}

class Game {
    constructor(questions, players) {
        this.questions = questions;
        this.players = players;
        this.counter = 0;
        this.currentPlayer = 0;
        this.gameOver = false;

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

            this.answers = shuffleArray(this.answers);
            player.textContent = this.players[this.currentPlayer].name;
            questionCounter.textContent = `${this.counter + 1} / ${this.questions.results.length}`;
            question.textContent = this.questions.results[this.counter].question;
            for (let i = 0; i < 4; i++) {
                optionButtons[i].value = this.answers[i].isCorrect;
                optionButtons[i].textContent = this.answers[i].answer;
            }
        } else {

            this.showResults();
            this.gameOver = true;

        }



    }

    checkIfCorrect(selected) {
        if (selected.value === 'true') {
            selected.style.backgroundColor = 'lightgreen';
            this.givePoint();
        } else {
            selected.style.backgroundColor = 'red';
            optionButtons.forEach(option => {
                if (option.value === 'true') {
                    option.style.backgroundColor = 'lightgreen';
                }
            })
        }
    }

    ableAndDisableOptions() {
        optionButtons.forEach(button => {
            button.disabled = !button.disabled;
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
    }

    showResults() {
        game.players.sort((a, b) => b.score - a.score);
        game.players.forEach(player => {
            const listItem = document.createElement('li');
            const name = document.createElement('p');
            name.textContent = player.name
            const score = document.createElement('p');
            score.textContent = `${player.score}/${game.questions.results.length / amountOfPlayers}`;
            listItem.appendChild(name)
            listItem.appendChild(score)

            resultList.appendChild(listItem);
        })
        gameDiv.classList.toggle('show');
        resultDiv.classList.toggle('show');
    }


}


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

radioButtons.forEach(button => {
    button.addEventListener('click', () => {
        difficulty = button.value;
    })
})

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        category = button.value;
        categoryButtons.forEach(button => {
            button.style.backgroundColor = 'white';
        })
        button.style.backgroundColor = 'lightgreen';
    })
})

introContinueButton.addEventListener('click', () => {
    if (!category == '' && !amountOfPlayers == 0 && !difficulty == '') {
        introDiv.classList.toggle('hidden');
        namesDiv.classList.toggle('show');
        getQuestions(category);
        makeNameInputs();
    } else {
        console.log('Choose a category and how many players');
        alert('Choose difficulty, a category and how many players');
    }

})



startGameButton.addEventListener('click', () => {
    const inputs = namesInputDiv.children;

    // Check if all inputs are filled
    if ([...inputs].every(input => input.value.trim() !== "")) {
        namesDiv.classList.toggle('show');
        gameDiv.classList.toggle('show');
        createPlayers();
        startGame();
    } else {
        // If any input is empty, alert the user
        alert("Please fill in all inputs with a name.");
    }

});

optionButtons.forEach(selected => {
    selected.addEventListener('click', () => {
        game.checkIfCorrect(selected);
        game.ableAndDisableOptions();
        nextQuestionBtn.classList.toggle('show');
    });
})

nextQuestionBtn.addEventListener('click', () => {
    nextQuestionBtn.classList.toggle('show')
    game.counter++;
    resetOptionColors();
    game.changePlayer();
    game.loadNewQuestion();
    game.ableAndDisableOptions();
    // optionButtons.forEach(button => {
    //     button.disabled = false;
    // })
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Get a random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
    }
    return array;
}

function resetOptionColors() {
    optionButtons.forEach(option => {
        option.style.backgroundColor = 'white';
    })
}

function showResults() {
    console.log('RESULTS')

}

async function getQuestions(category) {
    let response;

    switch (category) {
        case 'sports':
            try {
                response = await fetch(`https://opentdb.com/api.php?amount=${amountOfPlayers * 10}&category=21&difficulty=${difficulty}&type=multiple`);
                questions = await response.json();
                console.log(questions.results);
            }

            catch (error) {
                console.log(error);
            }
            break;
        case 'history':
            try {
                response = await fetch(`https://opentdb.com/api.php?amount=${amountOfPlayers * 10}&category=23&difficulty=${difficulty}&type=multiple`);
                questions = await response.json();
                console.log(questions.results);
            }

            catch (error) {
                console.log(error);
            }
            break;
        case 'movies':
            try {
                response = await fetch(`https://opentdb.com/api.php?amount=${amountOfPlayers * 10}&category=11&difficulty=${difficulty}&type=multiple`);
                questions = await response.json();
                console.log(questions.results);
            }

            catch (error) {
                console.log(error);
            }
            break;
        case 'animals':
            try {
                response = await fetch(`https://opentdb.com/api.php?amount=${amountOfPlayers * 10}&category=27&difficulty=${difficulty}&type=multiple`);
                questions = await response.json();
                console.log(questions.results);
            }

            catch (error){
                console.log(error);
            }
            break;
        case 'mix':
            try {
                response = await fetch(`https://opentdb.com/api.php?amount=${amountOfPlayers * 10}&difficulty=${difficulty}&type=multiple`);
                questions = await response.json();
                console.log(questions);
            }

            catch (error) {
                console.log(error);
            }
            break;


    }
}

function makeNameInputs() {
    for (let i = 0; i < amountOfPlayers; i++) {
        const nameInput = document.createElement('input');
        nameInput.className = "name-input";
        namesInputDiv.append(nameInput);
    }
}

function createPlayers() {
    const players = [];
    for (let i = 0; i < amountOfPlayers; i++) {
        const player = new Player(document.querySelectorAll('.name-input')[i].value);
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




