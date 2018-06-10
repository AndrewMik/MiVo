import "../css/style.css";
import monsterNames from './monsterNames.json';
import dictionary from './dictionary.json';
import words from './words.json';
const pathToImgs = require.context("../img", true);
import $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/disable-selection';

const METEORITE = 'meteorite';
const FIST_HERO = 'fist-hero';
const FIST_MONSTER = 'fist-monster';

// Should run only once
$( function() {
  $( ".task__condition" ).sortable({
    axis: "x",
    cursor: "move"
  });
  $( ".task__condition" ).disableSelection();
} );

// Object used to speak
let utterance = new SpeechSynthesisUtterance();

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

  let monsterFigure = document.createElement('div');
  monsterFigure.classList.add('monster__figure');

  let monster = document.querySelector('.monster');

  monsterHead.style.backgroundPosition =
  Math.round(Math.random() * (headsNum + 1)) * 184 + "px 0";

  monsterBody.style.backgroundPosition =
  Math.round(Math.random() * (bodiesNum + 1)) * 234 + "px 0";

  monsterSatellite.style.backgroundPosition =
  Math.round(Math.random() * (satellitesNum + 1)) * 92 + "px 0";

  monsterFigure.appendChild(monsterHead);
  monsterFigure.appendChild(monsterBody);
  monster.appendChild(monsterFigure);
  monster.appendChild(monsterSatellite);

  createMonsterDialogue(monsterFigure);
}

function createMonsterDialogue(monsterDiv) {
  let monsterDialogue= document.createElement("div");
  monsterDialogue.classList.add("dialogue__monster");
  monsterDialogue.classList.add("dialogue--hidden");

  monsterDiv.appendChild(monsterDialogue);

  let monsterMessage = document.createElement("p");
  monsterMessage.classList.add("dialogue__monster-message");
  monsterDialogue.appendChild(monsterMessage);
}

function showGameInfoPanel() {
  document.querySelector('.panel').classList.remove('panel--hidden');
}

function showHeroes() {
  let heroContainer = document.querySelector(".hero");
  // heroContainer.appendChild(hero);

  let monsterContainer = document.querySelector(".monster");
  // monsterContainer.appendChild(monster);

  heroContainer.classList.add("hero--appear");
  monsterContainer.classList.add("monster--appear");
}

function changeMonster() {
  let monster = document.querySelector('.monster');
  monster.classList.add('monster--hide');
  setTimeout(() => {
    clearContainer(monster);
    // while (monster.firstChild) {
    //   monster.removeChild(monster.firstChild);
    // }
    generateMonster();
    monster.classList.remove('monster--hide');
  }, 2000);  
}

function setFullHealth() {
  document.querySelector('.state__health-monster').style.width = 100 + '%';
  document.querySelector('.state__health-hero').style.width = 100 + '%';
}

function startGame(level = 1) {
  
  setFullHealth();

  if (level !== 1) {
    changeMonster();
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
  // generateTaskMath();
  setTimeout(showFightBox, 2000);
  setTimeout(() => {
    hideFightBox();
    setTimeout(showHeroMessage, 1000);
    setTimeout(showMonsterMessage, 3000);
    setTimeout(chooseSpell, 5000);
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
  
  // let monsterNames = ;

  let name = '';
  let i = 0;
  let j = 0;
  let k = 0;
  
  i = rand(0, monsterNames.adj.length - 1);
  name += monsterNames.adj[i] + ' ';
  j = rand(0, monsterNames.root.length - 1);
  name += monsterNames.root[i] + ' ';
  k = rand(0, monsterNames.name.length - 1);
  name += monsterNames.name[i];
  

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
    showGameInfoPanel();
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
  let modalChooseSpell = document.getElementById('choose-spell');

  toggleElementVisibility(modalChooseSpell);

  let spellMath = document.getElementById('spell-math');
  setSpellTask(spellMath, generateTaskMath);

  let spellTranslation = document.getElementById('spell-translation');
  setSpellTask(spellTranslation, generateTaskTranslation);

  let spellSortLetters = document.getElementById('spell-sort-letters');
  setSpellTask(spellSortLetters, generateTaskSortLetters);

  let spellListening = document.getElementById('listening');
  setSpellTask(spellListening, generateTaskListening);

  document.body.addEventListener('click', checkModalChooseSpellClicked);
}

function hideModalChooseSpell() {
  let modalChooseSpell = document.getElementById('choose-spell');
  modalChooseSpell.classList.add('modal--hidden');
  document.body.removeEventListener('click', checkModalChooseSpellClicked);
}

//Screen task
function toggleTaskScreen() {
  let taskScreen = document.getElementById('task');

  toggleElementVisibility(taskScreen);
}

function toggleElementVisibility(element) {
  element.classList.toggle("modal--hidden");
}

function checkModalChooseSpellClicked() {
  let modalChooseSpell = document.getElementById('choose-spell');
  let modalContentChooseSpell = document.getElementById('choose-spell-content');

  //event.target is read only
  let eventTarget = event.target;
  let isModalContentClicked = false;

  while (eventTarget !== document.body) {
    if ( eventTarget === modalContentChooseSpell ) {
      isModalContentClicked = true;
    }
    eventTarget = eventTarget.parentElement;
  }

  if (!isModalContentClicked) {
    toggleElementVisibility(modalChooseSpell);
  }
}

function setSpellTask(spell, generateSpellTask) {
  spell.addEventListener('click', hideModalChooseSpell);
  spell.addEventListener('click', toggleTaskScreen);
  spell.addEventListener('click', generateSpellTask);
}

function generateTaskMath() {
  $(".task__condition").sortable("disable");
  const taskForm = getTaskForm();
  const taskCondContainer = getCondContainer();
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
  
  let correctAnswer;
  let firstNumber = getRandomInt(min, max);
  let secondNumber = getRandomInt(min, max);
  let mathOperator;
  let mathOperation = operations[getRandomInt(0, 3)];
  math[mathOperation](firstNumber, secondNumber);
  const EQUALS = '=';

  const taskTranslationMessage = "Реши пример";
  showTaskMessage(taskTranslationMessage);

  const userInput = createInputForAnswer();

  clearContainer(taskCondContainer);
  
  appendCondition(taskCondContainer, firstNumber, mathOperator, secondNumber, EQUALS, userInput);
  // taskCondContainer.appendChild(userInput);

  taskForm.addEventListener('submit', solveMathTask);
  
  function solveMathTask() {    
    solveTask(taskForm, userInput, correctAnswer, solveMathTask, event);
  }
}

function solveTask(taskElement, userInput, correctAnswer, eventHandlerFunction, currentEvent) {
  currentEvent.preventDefault();
  let userAnswer;
  if (typeof userInput === 'object' ) {
    userAnswer = userInput.value.toLowerCase();   
  } else {
    userAnswer = userInput;
  }

  let isAnswerCorrect = false;

  if( +userAnswer === correctAnswer || userAnswer === correctAnswer) {
    isAnswerCorrect = true;
  } else if (Array.isArray(correctAnswer)) {
    correctAnswer.forEach(answer => {
      if(answer === userAnswer) {
        isAnswerCorrect = true;
        showMonsterMessage('Как ты догадался?!');
      }
    });
  } else {
    showMonsterMessage(`Уха-ХA-ха!`);
  }

  fightRound(isAnswerCorrect);

  closeTask(taskElement, eventHandlerFunction);
}

function closeTask(taskElement, eventHandlerFunction) {
  taskElement.removeEventListener('submit', eventHandlerFunction);
  document.getElementById('task').classList.add("modal--hidden");
}

function fightRound(isHeroHitsMonster) {
  let monsterHealth = document.querySelector('.state__health-monster');
  let heroHealth = document.querySelector('.state__health-hero');
  let isMonsterDead = false;
  let isHeroDead = false;

  const delayMonsterSpellAnimation = 3000;
  let delayMonsterHit = 0;

  if (isHeroHitsMonster) {
    isMonsterDead = damageMonster();

    if (isMonsterDead) {
      return;
    }

    setTimeout(() => {
      delayMonsterHit = castSpell(FIST_MONSTER);
      damageHero(delayMonsterHit);
    }, delayMonsterSpellAnimation);
  } else {
    delayMonsterHit = castSpell(FIST_MONSTER);
    damageHero(delayMonsterHit);
  }

  function damageMonster(){
      isMonsterDead = damageOpponent(monsterHealth, maxDamageFromUser);
      if (isMonsterDead) {
        victory();
        setTimeout(() => {
          startGame(+document.querySelector('.level__num').textContent + 1);
        }, 4000);
      } 
    return isMonsterDead;
  }

  function damageHero(milliseconds = 3000){
    setTimeout(() => {
      isHeroDead = damageOpponent(heroHealth, maxDamageFromMonster);
      if (isHeroDead) {
        gameOver();
      } else {
        setTimeout(chooseSpell, 3000);
      }
    }, milliseconds);
  }
  return isHeroDead;
}

function victory(){
  showHeroMessage(`Я ЕСТЬ ГРУУУУУУУТ!!!`);
  maxDamageFromUser -= 1;
  maxDamageFromMonster += 2; 
}

function gameOver(){
  sayAfterDelay(showMonsterMessage, `Лузер!`, 1000);

  let winner = {};

  winner.nickName = document.getElementById('login').value || "Грут-аноним";
  winner.email = document.getElementById('email').value || "groot@groot.I.am";

  let currentLevel = document.querySelector('.level__text').innerText;
  currentLevel = currentLevel.replace("Уровень ", "");
  
  winner.monsterKilled = +currentLevel - 1;
 
  let bestPlayers = JSON.parse(localStorage.getItem('top-players')) || [];

  bestPlayers = compareWinnerWithBestPlayers(winner, bestPlayers);

  showBestPlayers(bestPlayers);
 
  localStorage.setItem('top-players', JSON.stringify(bestPlayers));

  function compareWinnerWithBestPlayers(winner, bestPlayers) {
    const maxNumberOfTopPlayers = 4;
    let currentTopPlayers = bestPlayers.length;

    for (let i = 0; i < maxNumberOfTopPlayers; i++) {
      if (bestPlayers[i] === undefined) {
        bestPlayers.push(winner);
        break;
      } else if (bestPlayers[i].monsterKilled < winner.monsterKilled) {
        bestPlayers.splice(i, 0, winner);

        if (bestPlayers.length === maxNumberOfTopPlayers + 1) {
          bestPlayers.pop();
        }
        break;
      }
    }
    return bestPlayers;
  }

      function showBestPlayers(bestPlayers) {
        let topScoresDiv = document.querySelector('.modal__top-scores');

        clearContainer(topScoresDiv);

        let table = document.createElement('table');
        let tr = document.createElement('tr');
        let placeHeader = document.createElement('th');
        let nickName = document.createElement('th');
        let monsterKilled = document.createElement('th');

        placeHeader.innerText = "Место";
        nickName.innerText = "Игрок";
        monsterKilled.innerText = "Убито монстров";

        tr.appendChild(placeHeader);
        tr.appendChild(nickName);
        tr.appendChild(monsterKilled);
        table.appendChild(tr);

        let place = 1;

        bestPlayers.forEach((player) => {
          let currentPlayerRow = document.createElement('tr');
          let placeOfPlayer = document.createElement('td');
          let playerNickName = document.createElement('td');
          let playerMonsterKilled = document.createElement('td');

          placeOfPlayer.innerText = place;
          playerNickName.innerText = player.nickName;
          playerMonsterKilled.innerText = player.monsterKilled;

          currentPlayerRow.appendChild(placeOfPlayer);
          currentPlayerRow.appendChild(playerNickName);
          currentPlayerRow.appendChild(playerMonsterKilled);
          table.appendChild(currentPlayerRow);

          place++;
        });

        topScoresDiv.appendChild(table);

        setTimeout(() => {
          toggleElementVisibility(document.getElementById('top-scores'));
        }, 3000);
      }
}

let maxDamageFromUser = 40;
let maxDamageFromMonster = 40;

function damageOpponent(opponentHealth, maxDamage) {
  let isDead = false;

  let heroHealth = document.querySelector('.state__health-hero');

  let currentDamage = Math.floor((Math.random() * maxDamage));

  let durationSpellAnimation = 2000;

  isDead = checkIsDead(opponentHealth, currentDamage);

  if (opponentHealth !== heroHealth) {
    showHeroMessage();

    if (currentDamage > maxDamage * 0.8) {
      durationSpellAnimation = castSpell(METEORITE);
    } else {
      durationSpellAnimation = castSpell(FIST_HERO);
    }

    let delayAfterSpellAnimation = durationSpellAnimation;

    setTimeout(() => {
      if(isDead){
          setHealthZero(opponentHealth);
          return;
      }
      reduceHealth(opponentHealth, currentDamage);

      if (currentDamage > maxDamage * 0.8) {
        sayAfterDelay(showHeroMessage, `Я есть Грут!<br><br>***Чертовски крут!***`, 1000);
      } else if (currentDamage < maxDamage * 0.2) {
        sayAfterDelay(showMonsterMessage, `Пффф... Слабак!<br><br> Каши мало ел?!`, 1000);
      }
    }, delayAfterSpellAnimation);

  } else if (isDead){
        setHealthZero(opponentHealth);
  } else {
      showMonsterMessage(`Получай!`);   
      reduceHealth(opponentHealth, currentDamage);
  }

  return isDead;
}

function checkIsDead(healthBar, damage){
  let health = Number.parseInt(healthBar.style.width);
  if(health - damage <= 0) {
    return true;
  }
  return false;
}

function setHealthZero(healthBar){
  healthBar.style.width = '0%';
}

function reduceHealth(healthBar, damage){
  healthBar.style.width = Number.parseInt(healthBar.style.width) - damage + "%";
  return false;
}

function generateTaskTranslation() {
  $(".task__condition").sortable("disable");
  const TASK_TRANSLATION = "translation";

  const taskForm = getTaskForm();
  let taskCondContainer = getCondContainer();

  clearContainer(taskCondContainer);
 
  const randomWordInDictionary = getRandomInt(0, dictionary.length-1);
  
  const word = dictionary[randomWordInDictionary]['word'];
  const correctAnswer = dictionary[randomWordInDictionary]['translation'];

  const taskTranslationMessage = "Переведи слово";
  showTaskMessage(taskTranslationMessage);

  const maxInputLength = 10;
  const userInput = createInputForAnswer(maxInputLength, TASK_TRANSLATION);

  appendCondition(taskCondContainer, word, userInput);
  // taskForm.appendChild(userInput);

  taskForm.addEventListener('submit', solveTranslationTask);
  
  function solveTranslationTask() {
    solveTask(taskForm, userInput, correctAnswer, solveTranslationTask, event);
  }
}

function generateTaskListening() {
  $(".task__condition").sortable("disable");
  const TASK_LISTENING = "listening";

  const taskForm = getTaskForm();
  let taskCondContainer = getCondContainer();

  clearContainer(taskCondContainer);
 
  const randomWordInDictionary = getRandomInt(0, dictionary.length-1);
  
  const word = dictionary[randomWordInDictionary]['word'];
  
  const correctAnswer = word;

  utterance.text = word;

  const taskListening = "Напиши услышанное слово";
  showTaskMessage(taskListening);

  const maxInputLength = 20;
  const userInput = createInputForAnswer(maxInputLength, TASK_LISTENING);

  let button = document.createElement('button');
  button.classList.add('task__repeat-button');
  button.innerText = 'Послушать';

  button.addEventListener('click', listenAgain);

  function listenAgain() {
    event.preventDefault();
    window.speechSynthesis.speak(utterance);
  }

  appendCondition(taskCondContainer, button, userInput);
  // taskForm.appendChild(userInput);

  taskForm.addEventListener('submit', solveTranslationTask);
  
  function solveTranslationTask() {
    solveTask(taskForm, userInput, correctAnswer, solveTranslationTask, event);
  }
}

function generateTaskSortLetters() {

  $(".task__condition").sortable("enable");

  const taskForm = getTaskForm();
  let taskCondContainer = getCondContainer();

  clearContainer(taskCondContainer);
 
  const randomWord = getRandomInt(0, words.length-1);
  
  const correctAnswer = words[randomWord];
  
  const letters = shuffleLetters(correctAnswer.split(''));  

  function shuffleLetters(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  const taskTranslationMessage = "Двигай буквы и собери слово";
  showTaskMessage(taskTranslationMessage);

  // const maxInputLength = 10;
  // const userInput = createInputForAnswer(maxInputLength, TASK_SORTLETTERS);

  // Append sortable letters
  let lettersFragment = document.createDocumentFragment();
  letters.forEach((letter) => {
    let p = document.createElement('p');
    p.textContent = letter;
    p.classList.add('task__letter');
    lettersFragment.appendChild(p);
  });

  appendCondition(taskCondContainer, lettersFragment);

  taskForm.addEventListener('submit', solveSortLettersTask);
  
  function solveSortLettersTask() {
    let userInput = getSortLettersSolution(taskCondContainer);
    $(".task__condition").sortable("disable");
    solveTask(taskForm, userInput, correctAnswer, solveSortLettersTask, event);
  }

  function getSortLettersSolution(container) {
    let letters = [...container.children];
    letters = letters.map((letter) => {
      return letter.innerText;
    });
    return letters.join('');   
  }
}

function getCondContainer() {
  return document.querySelector('.task__condition');
}

function getTaskForm() {
  return document.querySelector('.task');
}

function clearContainer(container) {
  while(container.firstElementChild) {
    container.removeChild(container.firstElementChild);
  }
}

function appendCondition(taskForm, ...conditions) {
  conditions.forEach( condition => {
    if (typeof condition !== 'object') {
      let conditionElement = document.createElement('p');
      conditionElement.textContent = condition;  
      taskForm.appendChild(conditionElement);
    } else {
      taskForm.appendChild(condition);
    }
  });
}

function showTaskMessage(textToDisplay) {
  let taskMessage = document.getElementById('task-todo-message');
  taskMessage.innerText = textToDisplay;
}

function createInputForAnswer(answerLength = 5, taskName) {  
  let userInput = document.createElement('input');

  userInput.type = "text";
  userInput.classList.add('task__input');
  userInput.placeholder = "Ответ";
  userInput.autofocus = true;
  userInput.maxLength = answerLength;
  userInput.autocomplete = "off";

  if(taskName) {
    userInput.classList.add('task__' + taskName);
  }

  return userInput;
}
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showHeroMessage(message, milliseconds) {
  message = message || "Я есть Грут!";
  milliseconds = milliseconds || 2000;

  document.querySelector(".dialogue__hero").classList.remove("dialogue--hidden");
  document.querySelector(".dialogue__hero-message").innerHTML = message;
  setTimeout(() => {
     document.querySelector(".dialogue__hero").classList.add("dialogue--hidden");
  }, milliseconds);
}

function showMonsterMessage(message, milliseconds) {
  message = message || "Ты есть грунт!!!";
  milliseconds = milliseconds || 2000;

  document.querySelector(".dialogue__monster").classList.remove("dialogue--hidden");
  document.querySelector(".dialogue__monster-message").innerHTML = message;
  setTimeout(() => {
     document.querySelector(".dialogue__monster").classList.add("dialogue--hidden");
  }, milliseconds);
}

function castSpell(spellName = FIST_HERO) {
  let spell = document.createElement("div");

  if(spellName === METEORITE) {
    spell.classList.add(METEORITE);
  } else if (spellName === FIST_MONSTER) {
    spell.classList.add(FIST_MONSTER);
  } else if (spellName === FIST_HERO) {
    spell.classList.add(FIST_HERO);
  }
  document.body.appendChild(spell);

  setTimeout(() => {
    document.body.removeChild(spell);
  }, 5000);

  let animationDuration = getComputedStyle(spell).animationDuration;
  animationDuration = Number.parseFloat(animationDuration) * 1000;
  return animationDuration;
}

function sayAfterDelay(func, message, delay){
  setTimeout(() => {  
    func(message);
  }, delay);
}