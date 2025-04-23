
// Intro
const introDiv = document.querySelector('.intro');
let category = "";
let difficulty = "";
const playerName = document.getElementById('player-name');
const radioButtons = document.querySelectorAll('.radio-btns');
const startGameBtn = document.getElementById('start-game-button');

let testCategory = document.getElementById('category');

// Game
const gameDiv = document.querySelector('.game');
const question = document.getElementById('question');
const optionButtons = document.querySelectorAll('.option');
const nextQuestionBtn = document.querySelector('.next-question');
const currentPlayerDiv = document.getElementById('current-player');
const questionCounter = document.getElementById('question-counter');
const exitBtn = document.getElementById('exit-game');
let game;

// Result
const resultDiv = document.querySelector('.result');
const resultList = document.getElementById('result-card');
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
    constructor(questions, player) {
        this.questions = questions;
        this.player = player;
        this.counter = 0;
    }

    loadNewQuestion() {
        if (this.counter < this.questions.results.length) {

            this.answers = [
                {
                    answer: formatQuestion(this.questions.results[this.counter].correct_answer),
                    isCorrect: true
                },
                {
                    answer: formatQuestion(this.questions.results[this.counter].incorrect_answers[0]),
                    isCorrect: false
                },
                {
                    answer: formatQuestion(this.questions.results[this.counter].incorrect_answers[1]),
                    isCorrect: false
                },
                {
                    answer: formatQuestion(this.questions.results[this.counter].incorrect_answers[2]),
                    isCorrect: false
                },
            ]

            this.answers = shuffleArray(this.answers);
            questionCounter.textContent = `${this.counter + 1} / ${this.questions.results.length}`;

            
            question.textContent = formatQuestion(this.questions.results[this.counter].question);
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
            button.style.backgroundColor = 'white';
        })
    }

    givePoint() {
        this.player.score++;
    }

    showResults() {
        resultList.innerHTML = '';
            const result = {
                score: game.player.score
            }
            
                const score = document.createElement('p');
                score.textContent = `${result.score}/10`;
                
                resultList.append(score);


    

        gameDiv.classList.toggle('show');
        resultDiv.classList.toggle('show');
    }


}

// Intro page



radioButtons.forEach(button => {
    button.addEventListener('click', () => {
        difficulty = button.value;
    })
})

startGameBtn.addEventListener('click', () => {
    category = testCategory.value;
    if (!category == '' && !playerName.value == '' && !difficulty == '') {
        introDiv.classList.toggle('hidden');
        gameDiv.classList.toggle('show');
        initilizeGame();
        
        
    } else {
        alert('Choose difficulty, a category and enter your name');
    }
    
})

async function initilizeGame() {
    
    const questions =  await getQuestions(category);
    console.log(questions);
    const player = createPlayer();
    console.log(player);
    createGame(questions,player)
}

async function getQuestions(category) {

    switch (category) {
        case 'sports':
            try {
                const response = await fetch(`https://opentdb.com/api.php?amount=10&category=21&difficulty=${difficulty}&type=multiple`);
                    return await response.json();
                } catch (error) {
                    console.log(error);
                }                
                break;
    
        case 'history':
            try {
                const response = await fetch(`https://opentdb.com/api.php?amount=10&category=23&difficulty=${difficulty}&type=multiple`);
                return await response.json();
            }

            catch (error) {
                console.log(error);
            }
            break;
        case 'movies':
            try {
                const response = await fetch(`https://opentdb.com/api.php?amount=10&category=11&difficulty=${difficulty}&type=multiple`);
                return await response.json();
            }

            catch (error) {
                console.log(error);
            }
            break;
        case 'animals':
            try {
                const response = await fetch(`https://opentdb.com/api.php?amount=10&category=27&difficulty=${difficulty}&type=multiple`);
                return await response.json();
            }

            catch (error) {
                console.log(error);
            }
            break;
    }
}


playerName.addEventListener('input', () => {
    const maxChars = 12;
    if (playerName.value.length > maxChars) {
        playerName.value = playerName.value.slice(0, maxChars);
        alert('Maxium 12 characters in Name')
    }
})

function createPlayer() {
    return new Player(playerName.value);
}

function createGame(questions,player) {
    console.log(questions);
    game = new Game(questions, player);
    startGame();
}

function startGame() {
    game.loadNewQuestion();
}


// Game

function formatQuestion(question) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = question;
    return textarea.value;
}

optionButtons.forEach(selected => {
    selected.addEventListener('click', () => {
        game.ableAndDisableOptions();
        game.checkIfCorrect(selected);
        nextQuestionBtn.classList.toggle('show');
    });
})

nextQuestionBtn.addEventListener('click', () => {
    nextQuestionBtn.classList.toggle('show')
    game.counter++;
    resetOptionColors();
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

exitBtn.addEventListener('click', () => {
    if(optionButtons[0].disabled) {
        game.ableAndDisableOptions();
    }
    testCategory.value = "";
    resetOptionColors();
    gameDiv.classList.toggle('show');
    reset();
   
})

// Result

newGameBtn.addEventListener('click', () => {
    resultDiv.classList.toggle('show');
    reset();

})

function reset() {
    introDiv.classList.toggle('hidden');
    playerName.value = '';
    radioButtons.forEach(radioBtn => {
        radioBtn.checked = false;
    })
    
}







