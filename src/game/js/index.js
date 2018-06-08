import "../css/style.css";
const pathToImgs = require.context("../img", true);

// Temporary loads the game
// TODO: Remove in last version
document.addEventListener("DOMContentLoaded", registerPlayer);

function initHero(heroName, char) {

  let character = document.querySelector(".hero");
  character.style.backgroundPosition = -(12 - char) * 267 + "px 0";
  
  setHeroName(heroName);
}

function generateMonster() {
  let headsNum = 28;
  let bodiesNum = 23;
  let satellitesNum = 5;

  let monsterHead = document.createElement("div");
  monsterHead.classList.add("monster__head");

  let monsterBody = document.createElement("div");
  monsterBody.classList.add("monster__body");

  let monsterSatellite = document.createElement("div");
  monsterSatellite.classList.add("monster__satellite");

  let monster = document.querySelector('.monster');
  let monsterFigure = document.querySelector('.monster__figure');

  monsterHead.style.backgroundPosition =
  Math.round(Math.random() * (headsNum + 1)) * 184 + "px 0";

  monsterBody.style.backgroundPosition =
  Math.round(Math.random() * (bodiesNum + 1)) * 234 + "px 0";

  monsterSatellite.style.backgroundPosition =
  Math.round(Math.random() * (satellitesNum + 1)) * 92 + "px 0";

  monsterFigure.appendChild(monsterHead);
  monsterFigure.appendChild(monsterBody);
  monster.appendChild(monsterSatellite);
}

function showHeroes() {
  let heroContainer = document.querySelector(".hero");
  // heroContainer.appendChild(hero);

  let monsterContainer = document.querySelector(".monster");
  // monsterContainer.appendChild(monster);

  heroContainer.classList.add("hero--appear");
  monsterContainer.classList.add("monster--appear");
}

function startGame(level = 1) {

  if (level !== 1) {
    changeMonster();
    setFullHealth();
  } else {
    generateMonster();
    showHeroes();
  }
  
  // Level by default is 1
  // If level === 1 showGuide() (guidance how to play, where to click and so on)
  // When monster will be defeated, we can call startGame()
  // again with incremented level

  let monsterName = generateMonsterName();
  setLevel(level);
  setMonsterName(monsterName);

  //   //Temporary loads math task
  //   // TODO: Remove in last version
  // toggleTaskScreen();
  // hideModalChooseSpell();
  // generateMathTask();
  setTimeout(showFightBox, 2000);
  setTimeout(() => {
    hideFightBox();
    setTimeout(chooseSpell, 1000);
    //Temporary shows and hides the modal dialogue to choose a spell
    // TODO: Remove in last version
    // setTimeout(hideModalChooseSpell, 2000);
    //Temporary shows and hides the screen with a task
    // TODO: Remove in last version
    // setTimeout(toggleTaskScreen, 3000);
    // setTimeout(toggleTaskScreen, 4000);
  }, 6000);
}

function hideFightBox() {
  document.querySelector(".fight-box").classList.add("fight-box--collapse");
  setTimeout(() => {
    document.querySelector(".fight-box").classList.add("fight-box--hidden");
    document.querySelector(".fight-box").classList.remove("fight-box--collapse");
  }, 1000);
}

function showFightBox() {
  document.querySelector(".fight-box").classList.remove("fight-box--hidden");
  document.querySelector('.fight-box__text').classList.add('fight-box__text--slide');
}

function setHeroName(heroName) {
  let hero = document.querySelector(".state__name--hero");
  hero.innerText = heroName;
}

function setMonsterName(monsterName) {
  let monster = document.querySelector(".state__name--monster");
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
      'Том', 'Илон', 'Макс', 'Юрий', 'Петя', 'Адам', 'Ефим', 'Алекс', 'Федя', 'Нил', 'Дэн', 'Ник', 'Роб', 'Миша', 
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

// function showGameField() {
//   let gameField = document.querySelector(".game-container");
//   gameField.classList.remove("game-container--hidden");
// }

// function hideLandingPage() {
//   let landing = document.querySelector(".landing-container");
//   landing.classList.add("landing-container--hidden");
// }

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
    initHero(login, char);
    startGame();
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
  if (clickedButton.classList.contains("role__prev") || clickedButton.classList.contains("role__prev-button")) {
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
  if (clickedButton.classList.contains("role__next") || clickedButton.classList.contains("role__next-button")) {
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

  setSpellMathEvent();

  document.body.addEventListener('click', checkModalChooseSpellClicked);
}

function hideModalChooseSpell() {
  let modalChooseSpell = document.getElementById('modal-choose-spell');
  let modalContentChooseSpell = document.getElementById('modal-content-choose-spell');

  modalChooseSpell.classList.add('modal--hidden');

  document.body.removeEventListener('click', checkModalChooseSpellClicked);
}

//Screen task
function toggleTaskScreen() {
  let taskScreen = document.getElementById('modal-screen-task');

  toggleElementVisibility(taskScreen);
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

function setSpellMathEvent() {
  let spellMath = document.getElementById('spell-math');

  spellMath.addEventListener('click', hideModalChooseSpell);
  spellMath.addEventListener('click', toggleTaskScreen);
  spellMath.addEventListener('click', generateMathTask);
}

function generateMathTask() {
  let mathTask = document.getElementById('task-to-solve');
  const min = 1;
  const max = 10;

  const operations = ['add', 'sub', 'mult', 'div'];

  const math = {
    'add': function(first, second) {
      mathOperator = '+';
      correctAnswer = first + second;
    },
    'sub': function(first, second) {
      mathOperator = '-';
      if (first < second) {
        [first, second] = [second, first];
        [firstNumber, secondNumber] = [secondNumber, firstNumber];
      }
      correctAnswer = first - second;
    },
    'mult': function(first, second) {
      mathOperator = '*';
      correctAnswer = first * second;
    },
    'div': function(first, second) {
      mathOperator = '÷';
      correctAnswer = first;
      firstNumber = first * second;
    }
  };
  
  mathTask.classList.add('math__numbers');
  
  let firstNumberElement = document.createElement('p');
  let mathOperatorElement = document.createElement('p');
  let secondNumberElement = document.createElement('p');
  let equalsElement = document.createElement('p');
  
  
  let correctAnswer;
  let firstNumber = getRandomInt(min, max);
  let secondNumber = getRandomInt(min, max);
  let mathOperator;
  let mathOperation = operations[getRandomInt(0, 3)];
  math[mathOperation](firstNumber, secondNumber);

  firstNumberElement.textContent = firstNumber;
  mathOperatorElement.textContent = mathOperator;
  secondNumberElement.textContent = secondNumber;

  equalsElement.textContent = '=';

  let userInput = document.createElement('input');
  userInput.type = "text";
  userInput.classList.add('task');
  userInput.placeholder = "Ответ";
  userInput.autofocus = true;
  userInput.maxLength = 4;
  userInput.id = "math-task-answer";
  userInput.autocomplete = "off";

  console.log(correctAnswer);

  while(mathTask.firstElementChild) {
    mathTask.removeChild(mathTask.firstElementChild);
  }

  mathTask.appendChild(firstNumberElement);
  mathTask.appendChild(mathOperatorElement);
  mathTask.appendChild(secondNumberElement);
  mathTask.appendChild(equalsElement);
  mathTask.appendChild(userInput);


  mathTask.addEventListener('submit', solveTask);
  
  function solveTask() {
    event.preventDefault();
    if( +userInput.value === correctAnswer) {
      let monsterHealth = document.querySelector('.state__health-monster');
      let maxDamage = 40;

      let currentDamage = Math.floor((Math.random() * maxDamage));
      alert('Вау!!! Ты ответил правильно!!! Гениально!!! Нанесено урона: ' + currentDamage);

      if(currentDamage > maxDamage*0.8) {
        alert('Опачки! Крит damage с вертушки!');
      } else if (currentDamage > maxDamage*0.1) {
        alert('Пффф... Слабак! Каши мало ел?!');
      }
      
      //I can't get initial health - it should be equal to 100% in css class state__health-monster
      if(monsterHealth.style.width <= 0) {
        monsterHealth.style.width = 100 - currentDamage + "%";
      } else {
        if(Number.parseInt(monsterHealth.style.width) - currentDamage <= 0) {
          monsterHealth.style.width = '0%';
          alert('Победа!');
          mathTask.removeEventListener('submit', solveTask);
          toggleTaskScreen();

          //some cool animation - monster is down
          startGame(+document.querySelector('.level__num').textContent + 1);
          // document.querySelector('.level__num').textContent = +document.querySelector('.level__num').textContent + 1;
          // TODO: make maxDamage lower, e.g. MAX_DAMAGE -= 1;
          // split user/monster damage?

          //generate new monster
          return;
        }
        monsterHealth.style.width = Number.parseInt(monsterHealth.style.width) - currentDamage + "%";
      }
    } else {
      alert('Друг мой, в этот раз ты дико ошибся, а мог нанести' + currentDamage + 'урона'); 
    }
    mathTask.removeEventListener('submit', solveTask);
    toggleTaskScreen();
    setTimeout(chooseSpell, 1000);
  }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}