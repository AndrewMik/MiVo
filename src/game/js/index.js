import "../css/style.css";
const pathToImgs = require.context("../img", true);

// Temporary loads the game
// TODO: Remove in last version
document.addEventListener("DOMContentLoaded", loadGame);

function loadGame() {
  // hideLandingPage();
  // showGameField();
  registerPlayer();

  // Temporary loads game
  // TODO: Remove in last version
  // toggleRegisterFieldVisibility();
  // startGame('Herooooo', 0);
}

function generateMonster() {
  let headsNum = 28;
  let bodiesNum = 23;
  let weaponsNum;
  let monsterHead = document.createElement("div");
  monsterHead.classList.add("monster__head");
  let monsterBody = document.createElement("div");
  let monster = document.createDocumentFragment();
  monsterBody.classList.add("monster__body");
  monsterHead.style.backgroundPosition =
    Math.round(Math.random() * (headsNum + 1)) * 184 + "px 0";
  monsterBody.style.backgroundPosition =
    Math.round(Math.random() * (bodiesNum + 1)) * 234 + "px 0";
  monster.appendChild(monsterHead);
  monster.appendChild(monsterBody);

  return monster;
}

function showHeroes(hero, monster) {
  let heroContainer = document.querySelector(".hero");
  // heroContainer.appendChild(hero);

  let monsterContainer = document.querySelector(".monster");
  monsterContainer.appendChild(monster);

  heroContainer.classList.add("hero--appear");
  monsterContainer.classList.add("monster--appear");
}

function startGame(heroName, char, level = 1) {
  let character = document.querySelector(".hero");
  character.style.backgroundPosition = -(12 - char) * 267 + "px 0";
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
  setTimeout(() => {
    hideFightBox();
    setTimeout(chooseSpell, 1000);
    //Temporary shows and hides the modal dialogue to choose a spell
    // TODO: Remove in last version
    setTimeout(hideModalChooseSpell, 2000);
    //Temporary shows and hides the screen with a task
    // TODO: Remove in last version
    setTimeout(showTaskScreen, 3000);
    // setTimeout(hideTaskScreen, 4000);
  }, 6000);
}

function hideFightBox() {
  document.querySelector(".fight-box").classList.add("fight-box--collapse");
}

function showFightBox() {
  document.querySelector(".fight-box").classList.remove("fight-box--hidden");
}

function setHeroNames(heroName, monsterName) {
  let hero = document.querySelector(".state__name--hero");
  let monster = document.querySelector(".state__name--monster");
  hero.innerText = heroName;
  monster.innerText = monsterName;
}

function generateMonsterName() {
  
  let db = {
    'adj': 
    [
      'сопливый', 'малый', 'синий', 'очумевший', 'светящийся', 'злобный', 'вонючий', 'летающий', 'пустынный', 
      'одинокий', 'пятнистый', 'ужасный', 'одноглазый', 'свирепый', 'костлявый', 'хилый', 'косой', 'грозный',
      'беспощадный', 'трусливый', 'серый', 'бессмертный', 'древний', 'черный', 'двуликий', 'мутный', 'слепой', 
      'зубастый', 'страшный', 'плоскомордый', 'ярый', 
    ],
    'root': 
    [
      // #0
      'туман', 'леший', 'огр', 'гном', 'гоблин', 'луч', 'гремлин', 'металл', 'зомби', 'тигр', 
      'вурдалак', 'неряха', 'забияка', 'волк', 'змей', 'призрак', 'упырь', 'крот', 'клык', 'бузак', 
      'Стужник', 'механоид', 'иглоид', 'слизень', 'прыгун', 'ползун', 'ветрила', 'дикарь', 'рыб', 
      'клыкан', 'хвостан', 'зубан', 'стенолом', 'гривослон', 'жаб', 'бомж', 'рог', 'кревет', 'хвост', 'свин', 'крыс', 
      'шум', 'монстр', 'клюв', 'свет', 'дрон', 'шторм', 
      // '', '', '', '', '', '', 
      // '', '', '', '', '', '', '', '', '', '', '', 
      // '', '', '', '', '', '', '', '', ''
    ],
    'name': 
    [
      'Том', 'Илон', 'Макс', 'Юрий', 'Петя', 'Фдам', 'Ефим', 'Алекс', 'Федя', 'Нил', 'Дэн', 'Ник', 'Роб', 'Миша', 
      'Аарон', 'Арсений', 'Дэвид', 'Руслан', 'Артур', 'Марк', 'Глеб', 'Егор', 'Илья', 'Клим', 'Ваня', 'Тим', 'Боб', 
      'Ян', 'Захар', 'Вадим', 'Коля', 'Георг', 'Макар', 'Игорь', 'Боря', 'Доминик', 'Ашот', 'Гавр', 'Гена'
    ],
  };

  let name = '';
  let i = 0;
  let j = 0;
  let k = 0;
  
  i = rand(0, db.adj.length - 1);
  name += db.adj[i] + ' ';
  j = rand(0, db.root.length - 1);
  name += db.root[i] + ' ';
  k = rand(0, db.name.length - 1);
  name += db.name[i];
  

  function rand(min, max) { 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return name;
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
  let form = document.querySelector(".register-form");
  form.classList.toggle("register-form--hidden");
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
    login = document.getElementById("login").value;
    mail = document.getElementById("email").value;
    char = document
      .querySelector(".role__slide--active")
      .getAttribute("data-slide");
    toggleRegisterFieldVisibility();
    startGame(login, char);
  });
}

function initCharacterSelectField() {
  let characterSelect = document.querySelector(".character-select");
  let partSelect = [...document.querySelectorAll(".part-select")];
  let roleSliders = [...document.querySelectorAll(".role__slider")];

  roleSliders.forEach((slider, index) => {
    setParts(slider, 13, index);
  });

  partSelect.forEach(slider => {
    setSliderEvents(slider);
  });
}

function setParts(slider, sources, index) {
  for (let i = 0; i < sources; i++) {
    let partSlide = document.createElement("div");
    partSlide.classList.add("role__slide");
    partSlide.setAttribute("data-slide", i);
    partSlide.style.left = i * 267 + "px";

    let character = document.createElement("div");
    character.classList.add("slide__img");
    character.style.backgroundPosition = (i + 1) * 267 + "px 0";

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
        slide.style.transform = "translateX(" + lastSlideNumber * -267 + "px)";
      });
    } else {
      // make previous indicator active
      let prevSlide = activeSlide.previousElementSibling;
      prevSlide.classList.add("role__slide--active");

      // switch to previous slide
      let prevSlideNumber = prevSlide.getAttribute("data-slide");
      slides.forEach(slide => {
        slide.style.transform = "translateX(" + prevSlideNumber * -267 + "px)";
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
        slide.style.transform = "translateX(" + firstSlideNumber * -267 + "px)";
      });
    } else {
      // make next indicator active
      let nextSlide = activeSlide.nextElementSibling;
      nextSlide.classList.add("role__slide--active");

      // switch to the next slide
      let nextSlideNumber = nextSlide.getAttribute("data-slide");
      slides.forEach(slide => {
        slide.style.transform = "translateX(" + nextSlideNumber * -267 + "px)";
      });
    }

    activeSlide.classList.remove("role__slide--active");
  }
}

function chooseSpell() {
  let modalChooseSpell = document.getElementById('modal-choose-spell');

  toggleElementVisibility(modalChooseSpell);

  document.body.addEventListener('click', checkModalChooseSpellClicked);
}

function hideModalChooseSpell() {
  let modalChooseSpell = document.getElementById('modal-choose-spell');
  let modalContentChooseSpell = document.getElementById('modal-content-choose-spell');

  modalChooseSpell.classList.add('modal--hidden');

  document.body.removeEventListener('click', checkModalChooseSpellClicked);
}

//Screen task
function showTaskScreen() {
  let taskScreen = document.getElementById('modal-screen-task');

  toggleElementVisibility(taskScreen);
}


//Screen task
function showTaskScreen() {
  let taskScreen = document.getElementById('modal-screen-task');

  toggleElementVisibility(taskScreen);
}


function hideTaskScreen() {
  let taskScreen = document.getElementById('modal-screen-task');

  taskScreen.classList.add('modal--hidden');
}

function toggleElementVisibility(element) {
  element.classList.toggle("modal--hidden");
}

function checkModalChooseSpellClicked() {
  let modalChooseSpell = document.getElementById('modal-choose-spell');
  let modalContentChooseSpell = document.getElementById('modal-content-choose-spell');

  //event.target is read only
  let eventTarget = event.target;
  let isModalContantClicked = false;

  while (eventTarget !== document.body) {
    if ( eventTarget === modalContentChooseSpell ) {
      isModalContantClicked = true;
    }
    eventTarget = eventTarget.parentElement;
  }

  if (!isModalContantClicked) {
    toggleElementVisibility(modalChooseSpell);
  }
}
