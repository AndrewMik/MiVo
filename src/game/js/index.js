import "../css/style.css";
import monsterNames from './json/monsterNames.json';
import dictionary from './json/dictionary.json';
import words from './json/words.json';
import antonyms from './json/antonyms.json';
import oddWords from './json/oddword.json';
import casesDB from './json/cases.json';
import animals from './json/animals.json';
import spelling from './json/spelling.json';
const pathToImgs = require.context("../img", true);
import $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/selectable';
import 'jquery-ui/ui/disable-selection';
import View from "./View";

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

$( function() {
  $( ".task__condition" ).selectable();
} );

// Object used to speak
let utterance = new SpeechSynthesisUtterance();

// Controller object
let view = new View();

// Temporary loads the game
// TODO: Remove in last version
document.addEventListener("DOMContentLoaded", registerPlayer);

function initHero(heroName, char) {

  let character = document.querySelector(".hero");
  character.style.backgroundPosition = -(12 - char) * 267 + "px 0";
  
  view.setHeroName(heroName);
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

function changeMonster() {
  let monster = document.querySelector('.monster');
  monster.classList.add('monster--hide');
  setTimeout(() => {
    view.clearContainer(monster);
    generateMonster();
    monster.classList.remove('monster--hide');
  }, 2000);  
}

function startGame(level = 1) {
  
  view.setFullHealth();

  if (level !== 1) {
    changeMonster();
  } else {
    generateMonster();
    view.showHeroes();
  }
  
  // Level by default is 1
  // If level === 1 showGuide() (guidance how to play, where to click and so on)

  let monsterName = generateMonsterName();
  view.setLevel(level);
  view.setMonsterName(monsterName);
  setTimeout(view.showFightBox, 2000);
  setTimeout(() => {
    view.hideFightBox();
    setTimeout(view.showHeroMessage, 1000);
    setTimeout(view.showMonsterMessage, 3000);
    if (level === 1) {
      setTimeout(chooseSpell, 5000);    
    } else {
      let modalChooseSpell = document.querySelector('#choose-spell');
      setTimeout(() => {view.toggleElementVisibility(modalChooseSpell);}, 5000);    
    }
  }, 6000);
}

function generateMonsterName() {

  let name = '';
  let i = 0;
  let j = 0;
  let k = 0;
  
  i = getRandomInt(0, monsterNames.adj.length - 1);
  name += monsterNames.adj[i] + ' ';
  j = getRandomInt(0, monsterNames.root.length - 1);
  name += monsterNames.root[i] + ' ';
  k = getRandomInt(0, monsterNames.name.length - 1);
  name += monsterNames.name[i];

  return name;
}

function registerPlayer() {

  let form = document.querySelector(".register-form");
  let infoPanel = document.querySelector(".game-info-panel");
  view.initCharacterSelectField();
  let login;
  let mail;
  let char;

  form.addEventListener("submit", e => {
    e.preventDefault();
    login = document.getElementById("login").value;
    mail = document.getElementById("email").value;
    char = document
      .querySelector(".role__slide--active")
      .getAttribute("data-slide");
    view.toggleElementVisibility(form);
    view.toggleElementVisibility(infoPanel);
    initHero(login, char);
    startGame();
  });
}

function chooseSpell() {
  let modalChooseSpell = document.getElementById('choose-spell');

  view.toggleElementVisibility(modalChooseSpell);

  generateSpellsForNextRound();

  document.body.addEventListener('click', view.checkModalChooseSpellClicked);
}

function setSpellTask(spell, generateSpellTask) {
  let modalChooseSpell = document.querySelector('#choose-spell');
  let taskScreen = document.querySelector('#task');
  spell.addEventListener('click', () => {
    view.toggleElementVisibility(modalChooseSpell);
    document.body.removeEventListener('click', view.checkModalChooseSpellClicked);
  });
  spell.addEventListener('click', () => {
    view.toggleElementVisibility(taskScreen);
  });
  spell.addEventListener('click', generateSpellTask);
}

function solveTask(taskElement, isAnswerCorrect, eventHandlerFunction, currentEvent) {
  currentEvent.preventDefault();

  fightRound(isAnswerCorrect);

  view.closeTask(taskElement, eventHandlerFunction);
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
    view.showMonsterMessage('Как ты догадался?!');

    if (isMonsterDead) {
      return;
    }

    setTimeout(() => {
      delayMonsterHit = view.castSpell(FIST_MONSTER);
      damageHero(delayMonsterHit);
    }, delayMonsterSpellAnimation);
  } else {
    view.showMonsterMessage(`Уха-ХA-ха!`);
    delayMonsterHit = view.castSpell(FIST_MONSTER);
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
        let modalChooseSpell = document.querySelector('#choose-spell');
        setTimeout(view.toggleElementVisibility(modalChooseSpell), 3000);
      }
    }, milliseconds);
  }

  generateSpellsForNextRound();

  return isHeroDead;
}

function victory(){
  view.showHeroMessage(`Я ЕСТЬ ГРУУУУУУУТ!!!`);
  maxDamageFromUser -= 1;
  maxDamageFromMonster += 2; 
}

function gameOver(){
  sayAfterDelay(view.showMonsterMessage, `Лузер!`, 1000);

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

        view.clearContainer(topScoresDiv);

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
          view.toggleElementVisibility(document.getElementById('top-scores'));
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
    view.showHeroMessage();

    if (currentDamage > maxDamage * 0.8) {
      durationSpellAnimation = view.castSpell(METEORITE);
    } else {
      durationSpellAnimation = view.castSpell(FIST_HERO);
    }

    let delayAfterSpellAnimation = durationSpellAnimation;

    setTimeout(() => {
      if(isDead){
          view.setHealthZero(opponentHealth);
          return;
      }
      view.reduceHealth(opponentHealth, currentDamage);

      if (currentDamage > maxDamage * 0.8) {
        sayAfterDelay(view.showHeroMessage, `Я есть Грут!<br><br>***Чертовски крут!***`, 1000);
      } else if (currentDamage < maxDamage * 0.2) {
        sayAfterDelay(view.showMonsterMessage, `Пффф... Слабак!<br><br> Каши мало ел?!`, 1000);
      }
    }, delayAfterSpellAnimation);

  } else if (isDead){
      view.setHealthZero(opponentHealth);
  } else {
      view.showMonsterMessage(`Получай!`);   
      view.reduceHealth(opponentHealth, currentDamage);
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

function generateTask(taskMessage, conditions, correctAnswer, className, isSortable = false, isSelectable = false) {
  view.toggleSortable(isSortable);
  view.toggleSelectable(isSelectable);

  let taskCondContainer = view.getCondContainer();
  view.clearContainer(taskCondContainer);
  view.showTaskMessage(taskMessage);

  let userInput;  

  if (className !== 'sortletters' && 
      className !== 'oddword' && 
      className !== 'cases' && 
      className !== 'spelling') {
    userInput = view.createInputForAnswer(className);
    conditions.push(userInput);
  }

  const taskForm = view.getTaskForm();
  view.appendCondition(taskCondContainer, conditions);

  taskForm.addEventListener('submit', solveCurrentTask);
  let userAnswer;
  function solveCurrentTask() {
    if (userInput) {
      userAnswer = getUserAnswer(className, userInput);
    } else {
      userAnswer = getUserAnswer(className);
    }
    
    let isAnswerCorrect = checkAnswer(userAnswer, correctAnswer); 
    solveTask(taskForm, isAnswerCorrect, solveCurrentTask, event);
  }
}

function checkAnswer(userAnswer, correctAnswer) {
  let flag = false;

  if( +userAnswer === correctAnswer || userAnswer === correctAnswer || userAnswer.toLocaleLowerCase() === correctAnswer) {
    return true;
  } else if (Array.isArray(correctAnswer)) {
    correctAnswer.forEach(answer => {
      if(answer === userAnswer) {
        flag = true;
      }
    });
  } else {
    return false;
  }

  return flag;
}

function getUserAnswer(className, userInput) {
  if (userInput) {
    return userInput.value;
  } 

  let container = view.getCondContainer();
  switch (className) {
    case 'sortletters':
      let letters = [...container.children];
      letters = letters.map((letter) => {
        return letter.innerText;
      });
      return letters.join('');
      break;
    case 'oddword':
      let word = container.querySelector('.ui-selected').textContent;
      return word;
      break;
    case 'cases':
    case 'spelling':
      return document.querySelector('.task__input').value;
      break;
  
    default:
      break;
  }
}

function generateTaskAntonyms() {

  const taskName = "antonyms";
  const taskMessage = "Наколдуй антоним";
  let conditions;

  const keys = ['word', 'antonym'];
 
  const randomPair = getRandomInt(0, antonyms.length-1);
  const randomIndex = getRandomInt(0, 1);
  const randomKey = keys[randomIndex];
  const correctAnswerKey = keys[Math.abs(randomIndex-1)];
  
  const word = antonyms[randomPair][randomKey];
  const correctAnswer = antonyms[randomPair][correctAnswerKey];

  conditions = [word];
  
  generateTask(taskMessage, conditions, correctAnswer, taskName);
}

function generateTaskListening() {

  const taskName = "listening";
  const taskMessage = "Напиши услышанное слово";
  let conditions;
 
  const randomWordInDictionary = getRandomInt(0, dictionary.length-1);
  const word = dictionary[randomWordInDictionary]['word'];
  const correctAnswer = word;

  utterance.text = word;

  let button = document.createElement('button');
  button.classList.add('task__repeat-button');
  button.innerText = 'Послушать';

  button.addEventListener('click', listenAgain);

  function listenAgain() {
    event.preventDefault();
    window.speechSynthesis.speak(utterance);
  }

  conditions = [button];

  generateTask(taskMessage, conditions, correctAnswer, taskName); 
}

function generateTaskSortLetters() {

  const taskName = 'sortletters';
  const taskMessage = "Двигай буквы и собери слово";
  let conditions= [];
 
  const randomWord = getRandomInt(0, words.length-1);
  const correctAnswer = words[randomWord];
  const letters = shuffle(correctAnswer.split(''));  

  letters.forEach((letter) => {
    conditions.push(letter);
  });

  generateTask(taskMessage, conditions, correctAnswer, taskName, true, false);
}

function generateTaskOddWord() {

  const taskName = 'oddword';
  const taskMessage = "Выбери лишнее слово";
  let conditions = [];
 
  const randomWord = getRandomInt(0, oddWords.length-1);
  const correctAnswer = oddWords[randomWord]['oddWord'];
  const words = shuffle(oddWords[randomWord]['words']);  

  words.forEach((word) => {
    conditions.push(word);
  });

  generateTask(taskMessage, conditions, correctAnswer, taskName, false, true);
}

function generateTaskTranslation() {

  const taskName = "translation";
  const taskMessage = "Переведи слово";
  let conditions;
 
  const randomWordInDictionary = getRandomInt(0, dictionary.length-1);
  const word = dictionary[randomWordInDictionary]['word'];
  const correctAnswer = dictionary[randomWordInDictionary]['translation'];

  conditions = [word];

  generateTask(taskMessage, conditions, correctAnswer, taskName);

}

function generateTaskMath() {

  const taskName = 'math';
  const taskMessage = "Реши пример";
  let conditions;

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

  conditions = [firstNumber, mathOperator, secondNumber, EQUALS];

  generateTask(taskMessage, conditions, correctAnswer, taskName);
}

function generateTaskCases() {

  const taskName = 'cases';
  const taskMessage = "Введите слово в правильном падеже";
  let conditions = [];
 
  const cases = casesDB['cases'];
  const randomSet = casesDB['words'][getRandomInt(0, casesDB['words'].length-1)];
  const randomCaseIndex = getRandomInt(1, randomSet.length-1);
  const correctAnswer = randomSet[randomCaseIndex];

  for (let i = 0; i < cases.length; i++) {
    conditions.push(cases[i]); 
    if (i === randomCaseIndex) {
      let userInput = view.createInputForAnswer(taskName);  
      conditions.push(userInput);
    } else {
      conditions.push(randomSet[i]);
    }
  }
  
  generateTask(taskMessage, conditions, correctAnswer, taskName);
}

function generateTaskGuessAnimal() {

  const taskName = "guess-animal";
  const taskMessage = "Напиши имя животного";
  let conditions;
 
  const randomAnimal = animals[getRandomInt(0, animals.length-1)];
  const randomAnimalCoord = randomAnimal['coordinates'];
  const correctAnswer = randomAnimal['answers'];

  let img = document.createElement('img');
  img.classList.add('task__img');
  img.style.backgroundPosition = randomAnimalCoord;
  conditions = [img];

  generateTask(taskMessage, conditions, correctAnswer, taskName);
}

function generateTaskSpelling() {

  const taskName = 'spelling';
  const taskMessage = "Вставь букву, две или ничего";
  let conditions = [];
 
  const randomSet = spelling[getRandomInt(0, spelling.length-1)];
  const firstPart = randomSet['firstPart'];
  const secondPart = randomSet['secondPart'];
  const correctAnswer = randomSet['letter'];

  let userInput = view.createInputForAnswer(taskName);  
  conditions.push(userInput);
  
  conditions = [firstPart, userInput, secondPart];

  generateTask(taskMessage, conditions, correctAnswer, taskName);
}

function shuffle(array) {
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sayAfterDelay(func, message, delay){
  setTimeout(() => {  
    func(message);
  }, delay);
}

const TASK_MATH = 'task-math';
const TASK_TRANSLATION = 'task-translation';
const TASK_SORT_LETTERS = 'task-sort-letters';
const TASK_LISTENING = 'task-listening';
const TASK_ANTONYMS = 'task-antonyms';
const TASK_ODD_WORD = 'task-odd-word';
const TASK_CASES = 'task-cases';
const TASK_ANIMALS = 'task-animals';
const TASK_SPELLING = 'task-spelling';

const TASKS = [
  TASK_MATH,
  TASK_TRANSLATION,
  TASK_SORT_LETTERS,
  TASK_LISTENING,
  TASK_ANTONYMS,
  TASK_ODD_WORD,
  TASK_CASES,
  TASK_ANIMALS,
  TASK_SPELLING
];

function generateSpellsForNextRound(numberOfSpells = 4) {
  const spells = document.getElementById('spells');

  view.clearContainer(spells);

  //copy array from all possible Tasks to create unique spells for round
  let taskOptions = TASKS.slice(0);

  let maxNumberOfSpells = taskOptions.length;

  if(numberOfSpells > maxNumberOfSpells) {
    numberOfSpells = maxNumberOfSpells;
  }

  for (let i = 0; i < numberOfSpells; i++) {

    let randomIndex = getRandomInt(0, taskOptions.length - 1);
    let randomTaskInArray = taskOptions.splice(randomIndex, 1);
    let randomTask = randomTaskInArray[0];

    //TODO: Remove in last version
    //FOR TESTING new spells just set your spell to randomTask
    //randomTask = TASK_MATH;
    let spell = document.createElement('img');

    spell.classList.add("spells__item");
    spell.classList.add(randomTask);

    spells.appendChild(spell);

    switch (randomTask) {
      case TASK_MATH:
        setSpellTask(spell, generateTaskMath);
        break;
      case TASK_TRANSLATION:
        setSpellTask(spell, generateTaskTranslation);
        break;
      case TASK_SORT_LETTERS:
        setSpellTask(spell, generateTaskSortLetters);
        break;
      case TASK_LISTENING:
        setSpellTask(spell, generateTaskListening);
        break;
      case TASK_ANTONYMS:
        setSpellTask(spell, generateTaskAntonyms);
        break;
      case TASK_ODD_WORD:
        setSpellTask(spell, generateTaskOddWord);
        break;
      case TASK_CASES:
        setSpellTask(spell, generateTaskCases);
        break;
      case TASK_ANIMALS:
        setSpellTask(spell, generateTaskGuessAnimal);
        break;
      case TASK_SPELLING:
        setSpellTask(spell, generateTaskSpelling);
        break;
    }
  }
}

