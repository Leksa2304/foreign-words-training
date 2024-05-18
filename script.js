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

const copy = words.slice(); // создаем копию массива

function randomNoRepeats(arr) { // функция для генерации карточки (случайного объекта из массива)

    const index = Math.floor(Math.random() * copy.length);
    let obj = copy[index]; // получаем случайный объект
    copy.splice(index, 1); // удаляем полученный объект из копии массива, для дальнейшего генерирования неповторяющегося объекта
    return obj;
};

const getRandomObject = randomNoRepeats(copy); // случайный неповторяющийся объект массива - карточка

let words5 = [];

for (let i = 0; i < 5; i++) {

    words5.push(randomNoRepeats(copy)); // добавление в массив пяти слов
}

// отображение карточки
let cardIndex = 0; // индекс объекта в массиве
showCard(cardIndex);

function showCard(index) { // функция создания карточки
    cardFront.innerHTML = `${words5[index].word}`;
    cardBack.innerHTML = `${words5[index].translation}`;
    spanExample.innerHTML = `${words5[index].example}`;
}

function nextCard() { // переход к следующей карточке
    cardIndex = ++cardIndex;
    showCard(cardIndex);
}

function backCard() { // переход к карточке назад
    cardIndex = --cardIndex;
    showCard(cardIndex);
}


// обработчик на click по карточке
slider.addEventListener("click", function() {
    flipCard.classList.toggle("active");
});


// обработчик на стрелку вперед
buttonNext.addEventListener("click", function() {
    nextCard();
    currentWord.textContent++;

    if (currentWord.textContent > 1) {
        buttonBack.disabled = false; // включить кнопку назад
    }

    if (currentWord.textContent == 5) {
        buttonNext.disabled = true; // заблокировать кнопку вперед
    }
});

// обработчик на стрелку назад
buttonBack.addEventListener("click", function() {
    backCard();

    currentWord.textContent--;

    if (currentWord.textContent == 1) {

        buttonNext.disabled = false; // включить кнопку вперед
        buttonBack.disabled = true; // заблокировать кнопку назад
    }
});

// обработчик на кнопку Перемешать слова
shuffleWords.addEventListener("click", function() {
    shuffle(words5);
})

// Режим тестированиия - проверки знаний

// создание карточки в режиме тестирования
function createExamCard(obj) { // obj - объект массива
    const card = document.createElement("div");
    card.classList.add("card");

    const cardWord = document.createElement("p");
    cardWord.textContent = obj;
    card.append(cardWord);
    return card;
}


// вставка карточек
function renderExamCards() {

    const fragment = new DocumentFragment();
    const arrForExam = []; // создаем массив для перемешивания слов при тестировании
    words5.forEach((obj) => {
        const [engWord, ruWord] = [createExamCard(obj.word),
            createExamCard(obj.translation),

        ];
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