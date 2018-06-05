import "../css/style.css";
const pathToImgs = require.context("../img", true);

// this array can be used to make character consist of several parts
// you have to add in array below array of sources to images
// that will be different variants of a body part
// you also have to duplicate .part-select element in index.html
const CHARACTERS = [
  ['./char1.gif',
    './char2.gif',
    './char3.gif']
];

const playButton = document.querySelector(".button-play");
playButton.addEventListener("click", loadGame);

// Temporary loads the game
// TODO: Remove in last version
document.addEventListener("DOMContentLoaded", loadGame);

function loadGame() {
  hideLandingPage();
  showGameField();
  registerPlayer();

  // Temporary loads game
  // TODO: Remove in last version
  toggleRegisterFieldVisibility();
  startGame('Herooooo', 0);
}

function generateMonster() {

  let headsNum = 28;
  let bodiesNum = 23;
  let weaponsNum;
  let monsterHead = document.createElement("div");
  monsterHead.classList.add('monster__head');
  let monsterBody = document.createElement("div");
  let monster = document.createDocumentFragment();
  monsterBody.classList.add('monster__body');
  monsterHead.style.backgroundPosition = (Math.round(Math.random() * (headsNum + 1)) * 184) + 'px 0';
  monsterBody.style.backgroundPosition = (Math.round(Math.random() * (bodiesNum + 1)) * 234) + 'px 0';
  monster.appendChild(monsterHead);
  monster.appendChild(monsterBody);

  return monster;
}

function showHeroes(hero, monster) {
  let heroContainer = document.querySelector(".hero");
  heroContainer.appendChild(hero);

  let monsterContainer = document.querySelector(".monster");
  monsterContainer.appendChild(monster);

  heroContainer.classList.add("hero--appear");
  monsterContainer.classList.add("monster--appear");
}
  
function startGame(heroName, char, level = 1) {

  let character = document.createElement("img");  
  character.src = pathToImgs(CHARACTERS[0][char], true);
  let monster = generateMonster();

  showHeroes(character, monster);

  // Level by default is 1
  // If level === 1 showGuide() (guidance how to play, where to click and so on)
  // When monster will be defeated, we can call startGame()
  // again with incremented level

  let monsterName = generateMonsterName();
  setLevel(level);
  setHeroNames(heroName, monsterName);

  setTimeout(showFightBox, 2000);
  setTimeout(hideFightBox, 6000);
}

function hideFightBox() {
  document.querySelector('.fight-box').classList.add('fight-box--collapse');
}

function showFightBox() {
  document.querySelector('.fight-box').classList.remove('fight-box--hidden');
}

function setHeroNames(heroName, monsterName) {
  let hero = document.querySelector(".state__name--hero");
  let monster = document.querySelector(".state__name--monster");
  hero.innerText = heroName;
  monster.innerText = monsterName;
}

function generateMonsterName() {
  return "Monsterrrrrrr";
}

function setLevel(level) {
  document.querySelector(".level__num").innerText = level;
}

function showGameField() {
  let gameField = document.querySelector(".game-container");
  gameField.classList.remove("game-container--hidden");
}

function hideLandingPage() {
  let landing = document.querySelector(".landing-container");
  landing.classList.add("landing-container--hidden");
}

function toggleRegisterFieldVisibility() {
  let form = document.querySelector('.register-form');
  form.classList.toggle('register-form--hidden');
}

function registerPlayer() {
  toggleRegisterFieldVisibility();
  initCharacterSelectField();
  let login;
  let mail;
  let char;

  let form = document.querySelector(".register-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    login = document.getElementById('login').value;
    mail = document.getElementById('email').value;
    char = document.querySelector('.role__slide--active').getAttribute('data-slide');
    toggleRegisterFieldVisibility();
    startGame(login, char);
  });
}

function initCharacterSelectField() {
  let characterSelect = document.querySelector(".character-select");
  let partSelect = [...document.querySelectorAll(".part-select")];
  let roleSliders = [...document.querySelectorAll(".role__slider")];

  roleSliders.forEach((slider, index) => {
    setParts(slider, CHARACTERS[index], index);
  });

  partSelect.forEach(slider => {
    setSliderEvents(slider);
  });
}

function setParts(slider, sources, index) {
  for (let i = 0; i < sources.length; i++) {
    let partSlide = document.createElement("div");
    partSlide.classList.add("role__slide");
    partSlide.setAttribute("data-slide", i);
    partSlide.style.left = i * 248 + "px";

    let character = document.createElement("img");
    character.setAttribute("src", pathToImgs(sources[i], true));

    if (i === 0) {
      partSlide.classList.add("role__slide--active");
    }

    slider.appendChild(partSlide);
    partSlide.appendChild(character);
  }
}

function setSliderEvents(slider) {
  // TODO: add listeners for keyboard
  slider.addEventListener("click", slide);
}

function slide(e) {
  let slider = this;
  let slides = [...slider.querySelector(".role__slider").children];

  let slidesList = slider.querySelector(".role__slider");
  let activeSlide = slider.querySelector(".role__slide--active");

  let clickedButton = e.target;

  // PREVIOUS BUTTON
  // check if clicked button is 'previous button'
  if (clickedButton.classList.contains("role__prev-button")) {
    // check if active indicator is the first one
    if (activeSlide === slidesList.firstElementChild) {
      // make the last slide active
      let lastSlide = slidesList.lastElementChild;
      lastSlide.classList.add("role__slide--active");

      // switch to the last slide
      let lastSlideNumber = lastSlide.getAttribute("data-slide");
      slides.forEach(slide => {
        slide.style.transform = "translateX(" + lastSlideNumber * -248 + "px)";
      });
    } else {
      // make previous indicator active
      let prevSlide = activeSlide.previousElementSibling;
      prevSlide.classList.add("role__slide--active");

      // switch to previous slide
      let prevSlideNumber = prevSlide.getAttribute("data-slide");
      slides.forEach(slide => {
        slide.style.transform = "translateX(" + prevSlideNumber * -248 + "px)";
      });
    }

    activeSlide.classList.remove("role__slide--active");
  }

  // NEXT BUTTON
  // check if clicked button is 'next button'
  if (clickedButton.classList.contains("role__next-button")) {
    //check if active indicator is the last one
    if (activeSlide === slidesList.lastElementChild) {
      // make the first indicator active
      let firstSlide = slidesList.firstElementChild;
      firstSlide.classList.add("role__slide--active");

      // switch to the first slide
      let firstSlideNumber = firstSlide.getAttribute("data-slide");
      slides.forEach(slide => {
        slide.style.transform = "translateX(" + firstSlideNumber * -248 + "px)";
      });
    } else {
      // make next indicator active
      let nextSlide = activeSlide.nextElementSibling;
      nextSlide.classList.add("role__slide--active");

      // switch to the next slide
      let nextSlideNumber = nextSlide.getAttribute("data-slide");
      slides.forEach(slide => {
        slide.style.transform = "translateX(" + nextSlideNumber * -248 + "px)";
      });
    }

    activeSlide.classList.remove("role__slide--active");
  }
}
