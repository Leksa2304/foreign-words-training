"use strict";

const slider = document.querySelector(".slider");
const flipCard = document.querySelector(".flip-card");
const cardFront = document.querySelector("#card-front h1"); // иностранное слово
const cardBack = document.querySelector("#card-back h1"); // слово-перевод
const buttonNext = document.querySelector("#next"); // стрелка вперед
const buttonBack = document.querySelector("#back"); // стрелка назад
const buttonExam = document.querySelector("#exam"); //кнопка тестирование
const currentWord = document.querySelector("#current-word"); // номер текущего слова
const totalWord = document.querySelector("#total-word"); // всего слов
const shuffleWords = document.querySelector("#shuffle-words"); // кнопка перемешать слова

const divCardBack = document.querySelector("#card-back div");
const spanExample = divCardBack.querySelector("span"); // предложение-пример 
const examCardsContainer = document.querySelector("#exam-cards");

const studyMode = document.querySelector("#study-mode");
const examMode = document.querySelector("#exam-mode");
const studyCards = document.querySelector(".study-cards");
const time = document.querySelector("#time");
const timer = document.querySelector("#timer");
const resultsModal = document.querySelector(".results-modal");
const resultsContent = document.querySelector(".results-contenеt");
const sliderControls = document.querySelector(".slider-controls");
const content = document.querySelector("content");
// прогресс бар
const wordsProgress = document.querySelector("#words-progress"); // прогресс бар в режиме экзамен
const examProgress = document.querySelector("#exam-progress"); // прогресс бар в режиме экзамен
const imgMotivation = document.querySelector(".img-motivation");


const words = [
    { word: "dog", translation: "собака", example: "Dogs don't like cats" },
    { word: "watermelon", translation: "арбуз", example: "Watermelon is a large striped berry" },
    { word: "rainbow", translation: "радуга", example: "Rainbow sometimes happen after rain" },
    { word: "unicorn", translation: "единорог", example: "Babygirls love unicorns" },
    { word: "cacao", translation: "какао", example: "Cacao is rich in vatamin C" },
    { word: "baby", translation: "малыш", example: "Baby loves to play with toys" },
    { word: "desert", translation: "пустыня", example: "There is very little water in the desert" },
    { word: "cake", translation: "торт", example: "New York cheesecake is very popular in America" },
    { word: "ocean", translation: "океан", example: "The Pacific Ocean is the largest on planet Earth" },
    { word: "cucumber", translation: "огурец", example: "Сucumber is 90 percent water" },
]

const maxWords = 5; // кол-во карточек для изучения


// верные ответы и % верных слов
const percent = 100;
let correctWords = 0; // счетчик верных ответов
const percentOneCard = percent / maxWords; // процент верного ответа одной карточки
const correctPercent = document.querySelector("#correct-percent");
let correctNumPercent = parseInt(document.querySelector("#correct-percent").textContent);


const copy = words.slice(); // создаем копию массива


function getRandomWord(arr) { // функция для генерации карточки (случайного объекта из массива)
    const index = Math.floor(Math.random() * arr.length);
    const obj = arr[index]; // получаем случайный объект
    arr.splice(index, 1); // удаляем полученный объект из копии массива, для дальнейшего генерирования неповторяющегося объекта
    return obj;
};


function showCard(card) { // функция создания карточки
    cardFront.innerHTML = `${card.word}`;
    cardBack.innerHTML = `${card.translation}`;
    spanExample.innerHTML = `${card.example}`;
}

const wordsLearning = []; // массив слов для изучения

for (let i = 0; i < maxWords; i++) {
    wordsLearning.push(getRandomWord(copy)); // добавление в массив слов для изучения
}


// отображение карточки
let cardIndex = 0; // индекс объекта в массиве

showCard(wordsLearning[cardIndex]);
wordsProgress.value = percentOneCard;


function goToNextCard() { // переход к следующей карточке
    if (cardIndex < (maxWords - 1)) {
        cardIndex = ++cardIndex;
        showCard(wordsLearning[cardIndex]);
        updateNextProgressBar(wordsProgress, percentOneCard);
    }
}

function goToBackCard() { // переход к карточке назад
    if (cardIndex > 0) {
        cardIndex = --cardIndex;
        showCard(wordsLearning[cardIndex]);
        updateBackProgressBar(wordsProgress, percentOneCard);
    }
}

// обработчик на click по карточке
slider.addEventListener("click", function() {
    flipCard.classList.toggle("active");
});

// функция блокировки кнопок
function blockButtons() {
    currentWord.textContent = cardIndex + 1;

    if (cardIndex === (maxWords - 1)) {
        buttonNext.disabled = true; // выкл.
    }
    if (cardIndex < (maxWords - 1)) {
        buttonNext.disabled = false; // вкл.
    }
    if (cardIndex > 0) {
        buttonBack.disabled = false; // вкл.
    }
    if (cardIndex === 0) {
        buttonBack.disabled = true; // выкл.
        buttonNext.disabled = false; // вкл.
    }
}

// обработчик на стрелку вперед
buttonNext.addEventListener("click", function() {
    goToNextCard();
    blockButtons();

});


// обработчик на стрелку назад
buttonBack.addEventListener("click", function() {
    goToBackCard();
    blockButtons();
});

// обработчик на кнопку Перемешать слова
shuffleWords.addEventListener("click", function() {
    shuffle(wordsLearning);
    showCard(wordsLearning[cardIndex]);
})

// Режим тестированиия - проверки знаний

// создание карточки в режиме тестирования
function createExamCard(text, otherText) { // obj - объект массива
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("word", text);
    card.setAttribute("translation", otherText);


    const cardWord = document.createElement("p");
    cardWord.textContent = text;
    card.append(cardWord);
    return card;
}


// функция для перемешивания элементов массива 
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let n = Math.floor(Math.random() * (i + 1));
        [array[i], array[n]] = [array[n], array[i]];
    }
    return array;
}


// вставка карточек
function renderExamCards() {

    const fragment = new DocumentFragment();
    const arrForExam = []; // создаем массив для перемешивания слов при тестировании
    wordsLearning.forEach((obj) => {
        const engWord = createExamCard(obj.word, obj.translation);
        const ruWord = createExamCard(obj.translation, obj.word);

        arrForExam.push(engWord, ruWord);
    });

    shuffle(arrForExam);
    fragment.append(...arrForExam);
    examCardsContainer.innerHTML = "";
    examCardsContainer.append(fragment);
}

// таймер
let timerId;
let seconds = 0;
let minutes = 0;

function startTimer() { //функция таймера

    seconds++;

    if (seconds === 59) {
        minutes++;
        seconds = 0;
    }

    time.textContent = `${format(minutes)}:${format(seconds)}`;
}

//добавление незначащих нулей
function format(val) {
    if (val < 10) {
        return `0${val}`
    }
    return val;
}

let examWords = []; // массив для двух карточек для сравнения


// запуск режима Тестирования-экзамена
function startExam() {
    studyCards.classList.add("hidden"); // скрываем режим обучения
    studyMode.classList.add("hidden"); // скрываем статистику study-mode
    examMode.classList.remove("hidden");
    renderExamCards();

    timerId = setInterval(startTimer, 1000); // запуск таймера
    examWords = [];
}


// обработчик на кнопку Тестирование
buttonExam.addEventListener("click", function() {
    startExam();
});


// обработчик на click по первой карточке
examCardsContainer.addEventListener("click", function(event) {

    const element = event.target.closest("div");

    if (element.classList.contains("fade-out")) {
        return;
    }

    examWords.push(element); // добавлять кликнутую карточку в массив двух карточек

    if (examWords.length === 1) { // это первая карточка
        element.classList.add("correct");
    }
    if (examWords.length === 2) { // это две карточки
        checkExamWords(examWords);
        examWords = [];
    }
});

// создание статистики
const template = document.querySelector("#word-stats"); // шаблон статистики ответов
const copyTemplate = template.content.cloneNode(true); // копия шаблона
resultsModal.append(copyTemplate);


function updatePercent(data) { // обновление процента верных ответов
    correctNumPercent = correctNumPercent + data;
    correctPercent.textContent = `${correctNumPercent}%`;
}

// обновление вперед прогресс бара
function updateNextProgressBar(name, data) { // параметр - id прогресса и процент верного ответа
    name.value = name.value + data;
}

function updateBackProgressBar(name, data) { // прогресс бар назад
    name.value = name.value - data;
}


function checkExamWords(checkedWords) { // проверка слов
    if (checkedWords[0].getAttribute("word") === checkedWords[1].getAttribute("translation")) {

        checkedWords[1].classList.add("correct");
        ++correctWords;

        updatePercent(percentOneCard); // процент правильных ответов
        updateNextProgressBar(examProgress, percentOneCard); // прогресс бар


        checkedWords[0].classList.add("fade-out");
        checkedWords[1].classList.add("fade-out");

    } else {
        checkedWords[1].classList.add("wrong");

        setTimeout(function() {
            checkedWords[0].classList.remove("correct");
            checkedWords[1].classList.remove("wrong");
        }, 500);
    }

    if (correctWords === maxWords) { // проверка на все отвеченные слова
        clearTimeout(timerId); // остановка таймера

        setTimeout(() => {
            alert("Тестирование успешно пройдено!");

            buttonStudyAgain.disabled = true; // выкл.
            buttonExamAgain.disabled = true;
            imgMotivation.classList.remove("hidden");

        }, 1000);

        setTimeout(() => {

            imgMotivation.classList.add("hidden");
            buttonStudyAgain.disabled = false; // вкл.
            buttonExamAgain.disabled = false;

        }, 5000);

        setTimeout(() => {
            resultsModal.classList.remove("hidden");
        }, 1000);

    }
    timer.textContent = `${time.textContent}`;
};


// создание дополнительных кнопок
function createButton(buttonID, buttonText, container) {
    const button = document.createElement("button");
    button.textContent = buttonText;
    button.id = buttonID;
    button.style.marginBottom = "10px";
    container.append(button);

}

createButton("button-study-again", "Назад к тренировке", examMode); // кнопка Назад к тренировке
const buttonStudyAgain = document.querySelector("#button-study-again");


createButton("button-exam-again", "Перезапустить экзамен", examMode); // кнопка Перезапустить экзамен
const buttonExamAgain = document.querySelector("#button-exam-again");

function resetExamMode() { // сброс режима экзамена
    clearTimeout(timerId);
    minutes = 0;
    seconds = 0;
    time.textContent = "";
    time.textContent = `${format(minutes)}:${format(seconds)}`;
    examCardsContainer.innerHTML = "";
    examWords = [];
    correctWords = 0;
    correctNumPercent = 0;
    examProgress.value = 0;
    correctPercent.textContent = `${correctNumPercent}%`;

    examMode.classList.add("hidden"); // скрываем статистику exam
    resultsModal.classList.add("hidden"); // скрываем итоговое окно статистики exam

}


buttonStudyAgain.addEventListener("click", function() {

    resetExamMode();

    studyMode.classList.remove("hidden"); // отобразить статистику в режиме тренировки
    studyCards.classList.remove("hidden"); // отобразить карточки в режиме тренировки

});

buttonExamAgain.addEventListener("click", function() {

    resetExamMode();
    startExam();
});