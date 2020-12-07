// *********************
// *  Query Selectors  *
// *********************
const numberDisplay = document.querySelector('#numberDisplay');
const settingsForm = document.querySelector('#gameSettings');
const answerField = document.querySelector('#answerField');

// ***********************
// * Game Initialization *
// ***********************
function resetGame() {
    game.numRounds = 2,
    game.roundLen = 3000,
    game.mathOperator = [],
    game.numRange = [],
    game.total = 0;
}
const game = {}
resetGame();

// ************************
// * Form Event Listeners *
// ************************
settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    resetGame();
    const settings = e.target.elements;
    const { numRounds, roundLength, mathOperator, numRange } = settings;
    game.numRounds = parseInt(numRounds.value);
    game.roundLen = parseInt(roundLength.value);
    if (!formVal(mathOperator, game.mathOperator)) {
        return numberDisplay.innerText = 'Please select a math operation';
    }
    if (!formVal(numRange, game.numRange)) {
        return numberDisplay.innerText = 'Please select a number range';
    }
    settingsForm.classList.toggle("d-none");
    playGame(game);
})
answerField.addEventListener('submit', (e) => {
    e.preventDefault();
    const total = game.total;
    const guess = parseInt(e.target.elements.answer.value);
    if (isNaN(guess)) {
        numberDisplay.innerText = "Your answer needs to be a number";
        return;
    }
    if (guess !== total) {
        numberDisplay.innerText = `${guess} is WRONG!! Try Again!`
    }
    if (guess === total) {
        numberDisplay.innerText = `${guess} is CORRECT!!! Play again?`
        e.target.elements.answer.value = "";
        answerField.classList.toggle("d-none");
        settingsForm.classList.toggle("d-none");
    }
})

// ***********************************************
// * Form validation and game settings populator *
// ***********************************************
function formVal(arg, arr){
    const checkboxes = Array.from(arg);
    return checkboxes.reduce(function(accumulator, currentValue) {
        if (currentValue.checked) {
            arr.push(currentValue.id);
        }
        return accumulator || currentValue.checked;
    }, false)
}

// ********************
// *  GAMEPLAY LOGIC  *
// ********************
// Select random array element
function randArrayEl(arr) {
    const randIndex = Math.floor(Math.random() * arr.length);
    return arr[randIndex];
}
// Number generating functions
const numGen = {
    rng() {
        return num = Math.floor(Math.random() * 10);
    },
    single() {
        return Math.floor(Math.random() * 9 + 1);
    },
    double() {
        const { single, rng } = this;
        return parseInt(`${single()}${rng()}`);
    },
    triple() {
        const { single, rng } = this;
        return parseInt(`${single()}${rng()}${rng()}`);
    }
}
// Random number range selector
function rangeSelector(range) {
    const rangeSelect = randArrayEl(range);
    if (rangeSelect === 'single') {
        return numGen.single()
    }
    if (rangeSelect === 'double') {
        return numGen.double()
    }
    if (rangeSelect === 'triple') {
        return numGen.triple()
    }
}
// Random select addition or subtraction
function operatorSelector(operator, number) {
    const operatorSelect = randArrayEl(operator);
    if (operatorSelect === 'minus') {
        return -number;
    }
    return number;
}
// *************************
// *  Start Game function  *
// *************************
playGame = async (gameSettings) => {
    const { numRounds, roundLen, mathOperator, numRange} = gameSettings;
    numberDisplay.classList.add("mt-5");
    await countdown();
    for (let i = 0; i <= numRounds; i++) {
        let number = rangeSelector(numRange);
        number = operatorSelector(mathOperator, number);
        if ( number > 0) {
            numberDisplay.innerText = `Add ${number}`;
        }
        if ( number < 0 ) {
            numberDisplay.innerText = `Subtract ${-number}`;
        }
        game.total += number;
        await roundTimer(roundLen);
        numberDisplay.innerText = "";
        await roundTimer(500);
    }
    numberDisplay.classList.remove("mt-5");
    numberDisplay.innerText = "What's the total?";
    answerField.classList.toggle("d-none");
}

// *********************
// *  Timer Functions  *
// *********************
// Pre-game countdown
async function countdown() {
    numberDisplay.innerText = `Starting in ...5`
    await countdownNumber(4);
    await countdownNumber(3);
    await countdownNumber(2);
    await countdownNumber(1);
    await countdownNumber("");
    await countdownNumber();
}
countdownNumber = (num) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            numberDisplay.innerText = `Starting in ...${num}`
            resolve();
        }, 1000);
    })
}
roundTimer = (roundLength) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, roundLength);
    })
}