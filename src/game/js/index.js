import "../css/style.css";
import monsterNames from './json/monsterNames.json';
import dictionary from './json/dictionary.json';
import words from './json/words.json';
import antonyms from './json/antonyms.json';
import oddWords from './json/oddword.json';
import casesDB from './json/cases.json';
import animals from './json/animals.json';
import spelling from './json/spelling.json';
import monsterPhrases from './json/monsterPhrases.json';
import heroPhrases from './json/heroPhrases';
const pathToImgs = require.context("../img", true);
import $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/selectable';
import 'jquery-ui/ui/disable-selection';
import View from "./View";

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
$( document ).ready(registerPlayer);

function initHero(heroName, char) {
  $(".hero").css("backgroundPosition", -(12 - char) * 267 + "px 0");
  view.setHeroName(heroName);
}

function generateMonster() {
  let headsNum = 28;
  let bodiesNum = 23;
  let satellitesNum = 5;

  let monsterHead = $("<div>")
  .addClass("monster__head")
  .css('backgroundPosition',
  Math.round(Math.random() * (headsNum + 1)) * 184 + "px 0");

  let monsterBody = $("<div>")
  .addClass("monster__body")
  .css('backgroundPosition',
  Math.round(Math.random() * (bodiesNum + 1)) * 234 + "px 0");

  let monsterSatellite = $("<div>")
  .addClass("monster__satellite")
  .css('backgroundPosition',
  Math.round(Math.random() * (satellitesNum + 1)) * 92 + "px 0");

  let monsterFigure = $('<div>')
  .addClass('monster__figure')
  .append(monsterHead)
  .append(monsterBody);

  let monster = $('.monster')
  .append(monsterFigure)
  .append(monsterSatellite);

  createMonsterDialogue(monsterFigure);
}

function createMonsterDialogue(monsterDiv) {

  let monsterMessage = $("<p>")
  .addClass("dialogue__monster-message");

  let monsterDialogue = $("<div>")
  .addClass("dialogue__monster")
  .addClass("dialogue--hidden")
  .append(monsterMessage);

  monsterDiv.append(monsterDialogue);
}

function changeMonster() {
  let monster = $('.monster');
  monster.addClass('monster--hide');
  setTimeout(() => {
    view.clearContainer(monster);
    generateMonster();
    monster.removeClass('monster--hide');
  }, 2000);  
}

function startGame(level = 1) {

  view.setFullHealth();

  let mp3 = require('./../mp3/round-1-fight.mp3');
  let audioPlayer = new Audio(mp3);

  if (level !== 1) {
    changeMonster();
    mp3 = require('./../mp3/r2d2.mp3');
    audioPlayer = new Audio(mp3);
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
  setTimeout(audioPlayer.play.bind(audioPlayer), 2000);

  setTimeout(() => {
    view.hideFightBox();
  
    let greetingsHeroMessage = `${getRandomPhrase(heroPhrases.hello)}, ${$(".state__name--monster").text().split(" ")[2]}!`;
    sayAfterDelay(view.showHeroMessage.bind(view), greetingsHeroMessage, 1000);

    let greetingsMonsterMessage = `${getRandomPhrase(monsterPhrases.hello)}, ${$(".state__name--hero").text() ? $(".state__name--hero").text() : "чужестранец"}!`;
    sayAfterDelay(view.showMonsterMessage.bind(view), greetingsMonsterMessage, 3000);

    if (level === 1) {
      setTimeout(chooseSpell, 5000);    
    } else {
      let modalChooseSpell = $('#choose-spell');
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

  let form = $(".register-form");
  let infoPanel = $(".game-info-panel");
  view.initCharacterSelectField();
  let login;
  let mail;
  let char;

  form.on("submit", e => {
    e.preventDefault();
    login = $("#login").val();
    mail = $("#email").val();
    char = $(".role__slide--active").attr("data-slide");
    view.toggleElementVisibility(form);
    view.toggleElementVisibility(infoPanel);
    initHero(login, char);
    startGame();
  });
}

function chooseSpell() {

  let modalChooseSpell = $('#choose-spell');
  view.toggleElementVisibility(modalChooseSpell);
  generateSpellsForNextRound();

  $('body').on('click', view.checkModalChooseSpellClicked);
}

function setSpellTask(spell, generateSpellTask) {
  let modalChooseSpell = $('#choose-spell');
  let taskScreen = $('#task');
  spell.on('click', () => {
    view.toggleElementVisibility(modalChooseSpell);
    $('body').off('click', view.checkModalChooseSpellClicked);
  });
  spell.on('click', () => {
    view.toggleElementVisibility(taskScreen);
  });
  spell.on('click', generateSpellTask);
}

function fightRound(isAnswerCorrect) {

  let isDead = false;
  let modalChooseSpell = $('#choose-spell');
  let monsterHealth = $('.state__health-monster');
  let heroHealth = $('.state__health-hero');

  const delaySpellAnimation = 3000;
  let delayMonsterHit = 0;

  if (isAnswerCorrect) {
    view.showMonsterMessage(getRandomPhrase(monsterPhrases.surprise));
    view.showHeroMessage(getRandomPhrase(heroPhrases.correctAnswer));
    isDead = damageOpponent('monster', monsterHealth, maxDamageFromUser);

    if (isDead) {
      return;
    }
    
    setTimeout(() => {
      isDead = damageOpponent('hero', heroHealth, maxDamageFromMonster); 
      setTimeout(() => {
        view.toggleElementVisibility(modalChooseSpell);
      }, delaySpellAnimation + 1000);
    }, delaySpellAnimation);

    if (isDead) {
      return;
    }
  } else {
    isDead = damageOpponent('hero', heroHealth, maxDamageFromMonster);

    setTimeout(() => {
      view.toggleElementVisibility(modalChooseSpell);
    }, delaySpellAnimation + 1000);

    if (isDead) {
      return;
    }
  }

  generateSpellsForNextRound();
}

function getRandomPhrase(arrayOfPhrases) {
  let randomPhraseNumber = getRandomInt(0, arrayOfPhrases.length - 1);
  return arrayOfPhrases[randomPhraseNumber];
}

function damageOpponent(opponent, opponentHealth, maxDamage) {

  const monsterAnimations = ['fist-monster', 'meteorite-monster'];
  const heroAnimations = ['fist-hero', 'meteorite-hero'];

  let currentDamage = Math.floor((Math.random() * maxDamage));
  let durationSpellAnimation = 2000;

  let isDead = checkIsDead(opponentHealth, currentDamage);

  let animation;
  let phrase;
  let message;
  let messageToSay;

  if (opponent === 'monster') {
    animation = heroAnimations;
    phrase = monsterPhrases;
    message = view.showMonsterMessage.bind(view);
  } else {
    animation = monsterAnimations;
    phrase = heroPhrases;
    message = view.showHeroMessage.bind(view);
  }

  let mp3 = require('./../mp3/punch.mp3');

  if (currentDamage > maxDamage * 0.8) {
    durationSpellAnimation = view.castSpell(animation[1]);
    messageToSay = getRandomPhrase(phrase.criticalDamage);
    sayAfterDelay(message, messageToSay, durationSpellAnimation);
    mp3 = require('./../mp3/meteorite.mp3');
  } else if (currentDamage < maxDamage * 0.2) {
    durationSpellAnimation = view.castSpell(animation[0]);
    messageToSay = getRandomPhrase(phrase.weakDamage);
    sayAfterDelay(message, messageToSay, durationSpellAnimation);
    mp3 = require('./../mp3/weakHit.mp3');
  } else {
    durationSpellAnimation = view.castSpell(animation[0]);
    messageToSay = getRandomPhrase(phrase.normalDamage);
    sayAfterDelay(message, messageToSay, durationSpellAnimation);
  }

  setTimeout(() => {
    view.reduceHealth(opponentHealth, currentDamage);

    const audioPlayer = new Audio(mp3);
    audioPlayer.play();

    if (isDead) {
      if (opponent === 'monster') {
        setTimeout(() => {
          let mp3 = require('./../mp3/applause.mp3');
          let audioPlayer = new Audio(mp3);
          audioPlayer.play();
          finishRound();
          setTimeout(() => {
            startGame(+($('.level__num').text()) + 1);
          }, 4000);
        }, 0);
      } else {
        setTimeout(() => {
          let mp3 = require('./../mp3/gameOver.mp3');
          const audioPlayer = new Audio(mp3);
          setTimeout(() => {
            audioPlayer.play();
          }, 2000);
          finishGame();
        }, 0);
      }
    }
  }, durationSpellAnimation);

  return isDead;
}

function checkIsDead(healthBar, currentDamage){
  let health = Number.parseInt(view.getWidth(healthBar));
  if(health - currentDamage <= 0) {
    return true;
  }
  return false;
}

let maxDamageFromUser = 50;
let maxDamageFromMonster = 40;

function finishRound(){
  view.showHeroMessage(getRandomPhrase(heroPhrases.victory));
  maxDamageFromUser -= 1;
  maxDamageFromMonster += 2; 
}

function finishGame(){
  let messageMonsterSay = getRandomPhrase(monsterPhrases.victory);
  sayAfterDelay(view.showMonsterMessage.bind(view), messageMonsterSay, 0);

  let winner = {};

  winner.nickName = $('#login').val() || "Грут-аноним";
  winner.email = $('#email').val() || "groot@groot.I.am";

  let currentLevel = $('.level__num').text();
  
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

    let topScoresDiv = $('.modal__top-scores');
    // view.clearContainer(topScoresDiv);
    let table = $('<table><tr><th>Место</th><th>Игрок</th><th>Убито монстров</th></tr></table>');

    bestPlayers.forEach((player, place) => {
      let currentPlayerRow = $('<tr><td>' + (place + 1) + '</td><td>' + player.nickName + '</td><td>' + player.monsterKilled + '</td></tr>');
      table.append(currentPlayerRow);
    });

    topScoresDiv.append(table);

    setTimeout(() => {
      view.toggleElementVisibility($('#top-scores'));
    }, 3000);
  }
}

function generateTask(taskMessage, conditions, correctAnswer, className, isSortable = false, isSelectable = false) {
  view.toggleSortable(isSortable);
  view.toggleSelectable(isSelectable);

  let taskCondContainer = view.getCondContainer();
  view.clearContainer(taskCondContainer);
  view.showTaskMessage(taskMessage);
  taskCondContainer.addClass('task__condition--' + className);

  let userInput;  

  if (className !== 'sortletters' && 
      className !== 'oddword' && 
      className !== 'cases' && 
      className !== 'spelling') {
    userInput = view.createInputForAnswer();
    conditions.push(userInput);
  }

  const taskForm = view.getTaskForm();
  view.appendCondition(taskCondContainer, conditions);

  taskForm.on('submit', solveTask);
  let userAnswer;
  function solveTask() {
    if (userInput) {
      userAnswer = getUserAnswer(className, userInput);
    } else {
      userAnswer = getUserAnswer(className);
    }
    
    let isAnswerCorrect = checkAnswer(userAnswer, correctAnswer); 
    event.preventDefault();
    view.closeTask(taskForm, solveTask);
    fightRound(isAnswerCorrect);
  }
}

function checkAnswer(userAnswer, correctAnswer) {

  let isCorrect = false;
  if( +userAnswer === correctAnswer || userAnswer === correctAnswer || userAnswer.toLocaleLowerCase() === correctAnswer) {
    return true;
  } else if (Array.isArray(correctAnswer)) {
    correctAnswer.forEach(answer => {
      if(answer === userAnswer || userAnswer.toLocaleLowerCase() === answer) {
        isCorrect = true;
      }
    });
  } 

  let answerToShow = Array.isArray(correctAnswer) ? correctAnswer[0]: correctAnswer;
  answerToShow = capitalizeFirstLetter(answerToShow);

  if(!isCorrect) {
    let messageMonsterSay = getRandomPhrase(monsterPhrases.wrongAnswer);
    sayAfterDelay(view.showMonsterMessage.bind(view), messageMonsterSay, 0);
    messageMonsterSay = getRandomPhrase(monsterPhrases.correctAnswer);
    sayAfterDelay(view.showMonsterMessage.bind(view), `${messageMonsterSay} ${answerToShow}`, 700);
  }

  return isCorrect;
}

function capitalizeFirstLetter(string) {
  if(typeof string === "string") {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } 
  
  return string;
}

function getUserAnswer(className, userInput) {
  if (userInput) {
    return userInput.val();
  } 

  let container = view.getCondContainer();
  switch (className) {
    case 'sortletters':
      let letters = [...container.children()];
      letters = letters.map((letter) => {
        return letter.innerText;
      });
      return letters.join('');
      break;
    case 'oddword':
      let word = $('.ui-selected').text();
      return word;
      break;
    case 'cases':
    case 'spelling':
      return $('.task__input').val();
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
 
  const randomPair = antonyms[getRandomInt(0, antonyms.length-1)];
  const randomIndex = getRandomInt(0, 1);
  const randomKey = keys[randomIndex];
  const correctAnswerKey = keys[Math.abs(randomIndex-1)];
  
  const word = randomPair[randomKey];
  const correctAnswer = randomPair[correctAnswerKey];

  conditions = [word];
  
  generateTask(taskMessage, conditions, correctAnswer, taskName);
}

function generateTaskListening() {

  const taskName = "listening";
  const taskMessage = "Напиши услышанное слово";
  let conditions;
 
  const randomSet = dictionary[getRandomInt(0, dictionary.length-1)];
  const word = randomSet['word'];
  const correctAnswer = word;

  utterance.text = word;

  let button = $('<button>')
  .addClass('task__repeat-button')
  .text('Послушать');

  button.on('click', listenAgain);

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
 
  const randomWord = words[getRandomInt(0, words.length-1)];
  const correctAnswer = randomWord;
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
 
  const randomSet = oddWords[getRandomInt(0, oddWords.length-1)];
  const correctAnswer = randomSet['oddWord'];
  const words = shuffle(randomSet['words']);  

  words.forEach((word) => {
    conditions.push(word);
  });

  generateTask(taskMessage, conditions, correctAnswer, taskName, false, true);
}

function generateTaskTranslation() {

  const taskName = "translation";
  const taskMessage = "Переведи слово";
  let conditions;
 
  const randomSet = dictionary[getRandomInt(0, dictionary.length-1)];
  const word = randomSet['word'];
  const correctAnswer = randomSet['translation'];

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
  
  let correctAnswer;
  let firstNumber = getRandomInt(min, max);
  let secondNumber = getRandomInt(min, max);
  let mathOperator;
  let mathOperation = operations[getRandomInt(0, 3)];

  switch (mathOperation) {
    case 'add':
      mathOperator = '+';
      correctAnswer = firstNumber + secondNumber;
      break;
    case 'sub':
      mathOperator = '-';
      if (firstNumber < secondNumber) {
        [firstNumber, secondNumber] = [secondNumber, firstNumber];
      }
      correctAnswer = firstNumber - secondNumber;
      break;
    case 'mult':
      mathOperator = '*';
      correctAnswer = firstNumber * secondNumber;
      break;
    case 'div':
      mathOperator = '÷';
      correctAnswer = firstNumber;
      firstNumber = firstNumber * secondNumber;
      break;
    default:
      break;
  }

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
  const randomAnimalPos = randomAnimal['coordinates'];
  const correctAnswer = randomAnimal['answers'];

  let img = $('<img>')
  .addClass('task__img')
  .css('backgroundPosition', randomAnimalPos);
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

function generateSpellsForNextRound(numberOfSpells = 4) {

  const taskMath = 'task--math';
  const taskTranslation = 'task--translation';
  const taskSortLetters = 'task--sort-letters';
  const taskListening = 'task--listening';
  const taskAntonyms = 'task--antonyms';
  const taskOddWord = 'task--odd-word';
  const taskCases = 'task--cases';
  const taskAnimals = 'task--animals';
  const taskSpelling = 'task--spelling';

  const TASKS = [
    taskMath,
    taskTranslation,
    taskSortLetters,
    taskListening,
    taskAntonyms,
    taskOddWord,
    taskCases,
    taskAnimals,
    taskSpelling
  ];

  const spells = $('#spells');

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
    //randomTask = taskMath;
    let spell = $('<img>')
    .addClass("spells__item")
    .addClass(randomTask);

    spells.append(spell);

    switch (randomTask) {
      case taskMath:
        setSpellTask(spell, generateTaskMath);
        break;
      case taskTranslation:
        setSpellTask(spell, generateTaskTranslation);
        break;
      case taskSortLetters:
        setSpellTask(spell, generateTaskSortLetters);
        break;
      case taskListening:
        setSpellTask(spell, generateTaskListening);
        break;
      case taskAntonyms:
        setSpellTask(spell, generateTaskAntonyms);
        break;
      case taskOddWord:
        setSpellTask(spell, generateTaskOddWord);
        break;
      case taskCases:
        setSpellTask(spell, generateTaskCases);
        break;
      case taskAnimals:
        setSpellTask(spell, generateTaskGuessAnimal);
        break;
      case taskSpelling:
        setSpellTask(spell, generateTaskSpelling);
        break;
    }
  }
}

