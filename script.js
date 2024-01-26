let question;
let form;
let res;
let qno;
let score;
const questions = [
    {
        title: 'What is the chemical symbol for water?',
        options: [
            'H2O',
            'CO2',
            'O2',
            'N2'
        ],
        answer: '0',
        score: 1
    },
    {
        title: 'Which gas is responsible for the green color of plants?',
        options: [
            'Oxygen',
            'Carbon Dioxide',
            'Nitrogen',
            'Chlorophyll'
        ],
        answer: '3',
        score: 1
    },
    {
        title: 'What is the Earth\'s primary source of energy?',
        options: [
            'Wind',
            'Solar Radiation',
            'Geothermal Energy',
            'Fossil Fuels'
        ],
        answer: '1',
        score: 1
    },
    {
        title: 'Which planet is known as the Red Planet?',
        options: [
            'Earth',
            'Jupiter',
            'Mars',
            'Venus'
        ],
        answer: '2',
        score: 1
    },
    {
        title: 'What is the smallest unit of matter?',
        options: [
            'Atom',
            'Molecule',
            'Cell',
            'Particle'
        ],
        answer: '0',
        score: 1
    }
];


function restartScreen() {
    document.querySelector('.quiz-heading').innerHTML = `Total Score : ${totalScore}`
    const card = document.querySelector('.question-card');
    card.innerHTML = "<ul>";
    questions.forEach((ques, index) => {
        const isCorrect = form.op.value == ques.answer;
        const html = `
        <li>${ques.title} <div class="answer-label">${ques.options[ques.answer]}</div> - ${isCorrect ? 'Correct' : 'Incorrect'}</li>
        `;
        card.innerHTML += html;
    });
    card.innerHTML += "</ul>";
    document.querySelector('.answer-key').style.display = 'block';
    document.querySelector('button').style.display = 'block';
}

function resetradio() {
    document.querySelectorAll('[type="radio"]').forEach((radio) => {
        radio.removeAttribute("disabled");
    });
    res.setAttribute("class", "idle");
    res.innerHTML = "Empty";
}

function evaluate() {
    if (form.op.value == questions[qno].answer) {
        res.setAttribute("class", "correct");
        res.innerHTML = "Correct";
        totalScore += questions[qno].score;
    }
    else {
        res.setAttribute("class", "incorrect");
        res.innerHTML = "Incorrect";
    }
    document.querySelectorAll('[type="radio"]').forEach((radio) => {
        radio.setAttribute("disabled", "");
    });
}

let speechSynthesisUtterance;

function readText(text) {
    const speechSynthesis = window.speechSynthesis;
    if (speechSynthesisUtterance) {
        speechSynthesis.cancel();
    }
    speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speechSynthesisUtterance);
}

function getNextQuestion() {
    qno++;
    ques = questions[qno];
    question.innerHTML = ques.title;
    const labels = document.querySelectorAll('label');
    labels.forEach((label, idx) => {
        const optionText = ques.options[idx];
        label.innerHTML = `${String.fromCharCode(65 + idx)}: ${optionText}`;
    });

    const optionsText = ques.options.map((option, idx) => `${String.fromCharCode(65 + idx)}: ${option}`).join(', ');
    const textToRead = `Question: ${ques.title}. Options: ${optionsText}. Press 'r' for option A, 'g' for option C, 'f' for option D.`;
    readText(textToRead);
}

function selectOption(optionId) {
    const option = document.getElementById(optionId);
    if (option) {
        option.click();
    }
}
function handleKeyPress(event) {
    const key = event.key.toLowerCase();
    console.log(key);
    
    switch (key) {
        case 'r':
            selectOption('op1');
            break;
        case 'd':
            selectOption('op3');
            break;
        
            case 'g':
            selectOption('op2');
            break;
        case 'f':
            selectOption('op4');
            break;
        case 'arrowleft':
            if (form.submit.classList.contains('submit')) {
                form.submit.click();
            }
            break;
        case 'arrowright':
            if (form.submit.classList.contains('next')) {
                form.submit.click();
            }
            break;
        // Add more cases for other keys if needed
        default:
            break;
    }
}

function handleSubmit(e) {
    e.preventDefault();
    if (!form.op.value) {
        alert('Please select an option');
    }
    else if (form.submit.classList.contains('submit')) {
        evaluate();
        form.submit.classList.remove('submit');
        form.submit.value = "Next"
        form.submit.classList.add('next');
    }
    else if (qno < questions.length - 1 && form.submit.classList.contains('next')) {
        getNextQuestion();
        resetradio();
        form.submit.classList.remove('next');
        form.submit.value = "Submit"
        form.submit.classList.add('submit');
        form.reset();
    }
    else if (form.submit.classList.contains('next')) {
        restartScreen();
        form.submit.classList.remove('next');
        form.submit.value = "Submit"
        form.submit.classList.add('submit');
        form.reset();
    }
}

function init() {
    totalScore = 0;
    document.body.innerHTML = `
        <h1 class="quiz-heading">Quiz</h1>
        <div class="app-body">
            <h1 class="answer-key">Answer Key</h1>
            <div class="question-card">
                <h2 id='question'>Question</h2>
                <form>
                    <input type="radio" id="op1" name="op" value="0">
                    <label for="op1">op1</label><br>
                    <input type="radio" id="op2" name="op" value="1">
                    <label for="op2">op2</label><br>
                    <input type="radio" id="op3" name="op" value="2">
                    <label for="op3">op3</label><br>
                    <input type="radio" id="op4" name="op" value="3">
                    <label for="op4">op4</label><br>
                    <div id="res" class="idle">Empty</div><br>
                    <input type="submit" name="submit" value='Submit' class="submit"/>
                </form>
            </div>
            <button>Restart</button>
        </div>
    `;
    question = document.querySelector('#question');
    form = document.querySelector('form');
    res = document.querySelector('#res');
    qno = -1;
    form.addEventListener('submit', handleSubmit);
    document.querySelector('button').addEventListener('click', init);
    document.addEventListener('keydown', handleKeyPress);
    getNextQuestion();
}

document.querySelector('button').addEventListener('click', init);
init();