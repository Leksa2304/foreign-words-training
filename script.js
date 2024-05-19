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

const copy = words.slice(); // создаем копию массива

function getRandomWord(arr) { // функция для генерации карточки (случайного объекта из массива)

    const index = Math.floor(Math.random() * arr.length);
    let obj = arr[index]; // получаем случайный объект
    arr.splice(index, 1); // удаляем полученный объект из копии массива, для дальнейшего генерирования неповторяющегося объекта
    return obj;
};

function showCard(card) { // функция создания карточки
    cardFront.innerHTML = `${card.word}`;
    cardBack.innerHTML = `${card.translation}`;
    spanExample.innerHTML = `${card.example}`;
}


let wordsLearning = []; // массив слов для изучения

for (let i = 0; i < maxWords; i++) {

    wordsLearning.push(getRandomWord(copy)); // добавление в массив слов для изучения
}

// отображение карточки
let cardIndex = 0; // индекс объекта в массиве
showCard(wordsLearning[cardIndex]);


function nextCard() { // переход к следующей карточке
    if (cardIndex < (maxWords - 1)) {
        cardIndex = ++cardIndex;
        showCard(wordsLearning[cardIndex]);
    }
}

function backCard() { // переход к карточке назад
    if (cardIndex > 0) {
        cardIndex = --cardIndex;
        showCard(wordsLearning[cardIndex]);
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
    nextCard();
    blockButtons();
});


// обработчик на стрелку назад
buttonBack.addEventListener("click", function() {
    backCard();
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

// функция для перемешивания элементов массива 
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let n = Math.floor(Math.random() * (i + 1));
        [array[i], array[n]] = [array[n], array[i]];
    }
    return array;
}

// обработчик на кнопку Тестирование
buttonExam.addEventListener("click", function() {

    document.querySelector(".study-cards").classList.add("hidden"); // скрываем режим обучения
    document.querySelector("#study-mode").classList.add("hidden"); // скрываем статистику study-mode
    document.querySelector("#exam-mode").classList.remove("hidden");
    renderExamCards();

});

// обработчик на click по первой карточке
examCardsContainer.addEventListener("click", function(event) {
    const element = event.target.closest("div");

    let checkElement = [document.querySelector(".correct")]; // массив для элемента первого клика

    if (checkElement[0] === null) { // если нет в массиве зеленой карточки, то добавить зеленый на кликнутый элемент
        element.classList.add("correct");
    }
});