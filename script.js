
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
let amountOfPlayers = 1;


// Names
const namesDiv = document.querySelector('.names');
const namesInputDiv = document.querySelector('.names-div');
let nameInputs;
const startGameButton = document.getElementById('start-game');
const backBtn = document.getElementById('back');


// Game
const gameDiv = document.querySelector('.game');
const question = document.getElementById('question');
const optionButtons = document.querySelectorAll('.option');
const nextQuestionBtn = document.querySelector('.next-question');
const player = document.getElementById('current-player-name');
const currentPlayerDiv = document.getElementById('current-player');
const questionCounter = document.getElementById('question-counter');
let questions;
let game;

// Result
const resultDiv = document.querySelector('.result');
const resultList = document.getElementById('result-list');
const newGameBtn = document.getElementById('new-game');

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
            changeColorNameDiv(this.currentPlayer);
            player.textContent = this.players[this.currentPlayer].name;
            questionCounter.textContent = `${this.counter + 1} / ${this.questions.results.length}`;
            question.textContent = this.questions.results[this.counter].question;
            for (let i = 0; i < 4; i++) {
                optionButtons[i].value = this.answers[i].isCorrect;
                optionButtons[i].textContent = this.answers[i].answer;
            }
        } else {

            this.showResults();

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
        game.players.forEach((player,index) => {
            const listItem = document.createElement('li');
            const name = document.createElement('p');
            name.textContent = ` ${index + 1}. ${player.name}`
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

// Intro page

subtractPlayers.addEventListener('click', () => {
    if (amountOfPlayers > 1) {
        amountOfPlayers--;
        amountPlayersInput.textContent = amountOfPlayers;
    }
})

addPlayers.addEventListener('click', () => {
    if (amountOfPlayers < 5) {
        amountOfPlayers++;
        amountPlayersInput.textContent = amountOfPlayers;
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
        makeNameInputs();
    } else {
        console.log('Choose a category and how many players');
        alert('Choose difficulty, a category and how many players');
    }

})

async function getQuestions(category) {

    switch (category) {
        case 'sports':
            try {
                const response = await fetch(`https://opentdb.com/api.php?amount=${amountOfPlayers * 10}&category=21&difficulty=${difficulty}&type=multiple`);
                try {
                    questions = await response.json();
                } catch (error) {
                    console.log(error);
                }
            }

            catch (error) {
                console.log(error);
            }
            break;
        case 'history':
            try {
                const response = await fetch(`https://opentdb.com/api.php?amount=${amountOfPlayers * 10}&category=23&difficulty=${difficulty}&type=multiple`);
                questions = await response.json();
            }

            catch (error) {
                console.log(error);
            }
            break;
        case 'movies':
            try {
                const response = await fetch(`https://opentdb.com/api.php?amount=${amountOfPlayers * 10}&category=11&difficulty=${difficulty}&type=multiple`);
                questions = await response.json();
            }

            catch (error) {
                console.log(error);
            }
            break;
        case 'animals':
            try {
                const response = await fetch(`https://opentdb.com/api.php?amount=${amountOfPlayers * 10}&category=27&difficulty=${difficulty}&type=multiple`);
                questions = await response.json();
            }

            catch (error){
                console.log(error);
            }
            break;
    }
}


// Name page

backBtn.addEventListener('click', () => {
    namesDiv.classList.toggle('show');
    reset();
})

function makeNameInputs() {
    for (let i = 0; i < amountOfPlayers; i++) {
        const nameInput = document.createElement('input');
        nameInput.className = "name-input";
        namesInputDiv.append(nameInput);
    }

    nameInputs = document.querySelectorAll('.name-input');
    nameInputs.forEach(nameInput => {
    
        nameInput.addEventListener('input', () => {
            const maxChars = 12;
            if (nameInput.value.length > maxChars) {
                nameInput.value = nameInput.value.slice(0, maxChars); // Skär av överflödiga tecken
                alert('Maxium 12 characters in Name')
            }
        })
    })
}

startGameButton.addEventListener('click', async () => {
    const inputs = namesInputDiv.children;

    if ([...inputs].every(input => input.value.trim() !== "")) {
        namesDiv.classList.toggle('show');
        gameDiv.classList.toggle('show');
        const players = createPlayers();
        await getQuestions(category);
        createGame(players);
        startGame();
    } else {

        alert("Please fill in all inputs with a name.");
    }

});

function createPlayers() {
    const players = [];
    for (let i = 0; i < amountOfPlayers; i++) {
        const player = new Player(document.querySelectorAll('.name-input')[i].value);
        players.push(player);
    }

    return players
}

function createGame(players) {
    game = new Game(questions, players);
}

function startGame() {
    game.loadNewQuestion();
}


// Game

function changeColorNameDiv(playerNumber) {
    switch(playerNumber) {
        case 0: {
            currentPlayerDiv.style.backgroundColor = 'red';
            break;
        }
        case 1: {
            currentPlayerDiv.style.backgroundColor = 'blue';
            break;
        }
        case 2: {
            currentPlayerDiv.style.backgroundColor = 'green';
            break;
        }
        case 3: {
            currentPlayerDiv.style.backgroundColor = 'orange';
            break;
        }
        case 4: {
            currentPlayerDiv.style.backgroundColor = 'purple';
            break;
        }
    }
}

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
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}

function resetOptionColors() {
    optionButtons.forEach(option => {
        option.style.backgroundColor = 'white';
    })
}


// Result

newGameBtn.addEventListener('click', () => {
    resultDiv.classList.toggle('show');
    reset();
    
})

function reset() {
    introDiv.classList.toggle('hidden');
    namesInputDiv.innerHTML = '';
    amountOfPlayers = 1;
    amountPlayersInput.textContent = '1';
    categoryButtons.forEach(button => {
        button.style.backgroundColor = 'white';
    })
}







