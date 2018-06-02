import '../css/style.css';
import char1 from '../img/char1.gif';
import char2 from '../img/char2.gif';
import char3 from '../img/char3.gif';


const playButton = document.querySelector('.button-play');
playButton.addEventListener('click', loadGame);

//loadGame();

// document.addEventListener('DOMContentLoaded', loadGame);

function loadGame() {
  hideLandingPage();
  showGameField();
  registerPlayer();
  let canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  // let c = canvas.getContext('2d');

  const WIDTH = window.innerWidth;
  const WIDTH_HALF = WIDTH / 2;
  const WIDTH_QUOTER = WIDTH / 4;
  const HEIGHT = window.innerHeight;
  const HEIGHT_HALF = HEIGHT / 2;
  const HEIGHT_QUOTER = HEIGHT / 4;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const c = canvas.getContext('2d');

  let fontSize = 110;

  c.font = fontSize + 'pt Impact';
  c.textBaseline = 'middle';
  c.textAlign = 'center';


  const gradient = c.createLinearGradient(205, 25, 205, 200);

  gradient.addColorStop(0.00, 'red');
  gradient.addColorStop(0.16, 'orange');
  gradient.addColorStop(0.33, 'yellow');
  gradient.addColorStop(0.50, 'green');
  gradient.addColorStop(0.66, 'blue');
  gradient.addColorStop(0.83, 'indigo');
  gradient.addColorStop(1.00, 'violet');

  c.fillStyle = gradient;

  let i = 1;
  c.fillText('Round ' + i, WIDTH_HALF, 100);


  //Player's Health
  const HEALTH = 300;
  const HEALTHBAR_HEIGHT = 30;

  c.lineWidth = 2;
  c.strokeStyle = 'white';
  c.strokeRect(WIDTH_QUOTER - 150, HEIGHT - 435 - 50, HEALTH, HEALTHBAR_HEIGHT);

  c.fillStyle = 'red';
  c.fillRect(WIDTH_QUOTER - 150, HEIGHT - 435 - 50, HEALTH, HEALTHBAR_HEIGHT);

  fontSize = 50;

  c.font = fontSize + 'pt Arial';
  c.textBaseline = 'middle';
  c.textAlign = 'center';
  c.fillStyle = 'white';
  c.fillText('Ronaldo', WIDTH_QUOTER, HEIGHT - 435 - 100);



  //Mosnter's Health
  c.strokeStyle = 'white';
  c.strokeRect(WIDTH_QUOTER * 3 - 150, HEIGHT - 435 - 50, HEALTH, HEALTHBAR_HEIGHT);

  c.fillStyle = 'red';
  c.fillRect(WIDTH_QUOTER * 3 - 150, HEIGHT - 435 - 50, HEALTH, HEALTHBAR_HEIGHT);


  c.font = fontSize + 'pt Verdana';
  c.fillStyle = 'azure';
  c.fillText('Irina Shayk', WIDTH_QUOTER * 3, HEIGHT - 435 - 100);

  const monster = document.createElement('img');
  monster.setAttribute('src', './src/img/monster-1.png');

  // monster.onload = function () {
  //   c.drawImage(monster, WIDTH / 8 * 5.5, HEIGHT - 435);
  // }

  const player = document.createElement('img');
  player.setAttribute('src', './src/img/player-1.png');

  // player.onload = function () {
  //   c.drawImage(player, WIDTH / 8, HEIGHT - 415);
  // }

  const messageFight = document.createElement('img');
  messageFight.setAttribute('src', './src/img/fight.png');

  const ANIMATION_SPEED = 3;
  let x = 0;
  let y = 0;

  function animate() {

    if (x < WIDTH / 8 + 300) {
      requestAnimationFrame(animate);
      c.clearRect(0, HEIGHT_HALF - 50, WIDTH, HEIGHT);
      c.drawImage(player, -300 + x, HEIGHT - 415);

      c.drawImage(monster, WIDTH - y, HEIGHT - 435);

      x += ANIMATION_SPEED;
      y += ANIMATION_SPEED;

    } else {

      // c.fillStyle = 'black';
      // c.fillText('Fight!', WIDTH_HALF, HEIGHT_HALF);

      const widthMessageFight = 250;
      const timeToDisplayMessageFight = 1000;
    
      c.drawImage(messageFight, WIDTH_HALF - widthMessageFight/2, HEIGHT_HALF, widthMessageFight, widthMessageFight/2);

      setTimeout(() => {
        c.clearRect(WIDTH_HALF - widthMessageFight/2, HEIGHT_HALF, widthMessageFight, HEIGHT);
      }, timeToDisplayMessageFight);
    }
  }

  animate();
}
  
  // canvas.style.backgroundImage = 'url(' + Icon + ')';
  
// }

function showGameField() {
  let gameField = document.querySelector('.game-container');
  gameField.classList.remove('game-container--hidden');
}

function hideLandingPage() {
  let landing = document.querySelector('.landing-container');
  landing.classList.add('landing-container--hidden');
}


function showRegisterField() {
  let form = document.querySelector('.register-form');
  form.classList.remove('register-form--hidden');
}

let characters = [
  char1,
  char2,
  char3
];

function registerPlayer() {
  showRegisterField(); 
  initializeCharacterSelect(characters);
}

//
// IMPORTANT
// Copied JS
//

// document.addEventListener('DOMContentLoaded', function() {
//   // check if user disabled notifications
//   // if(localStorage.getItem('disabled') !== 'true') {
//     initializeNotif(tipsArray);
//   //   setTimeout(showNotif, 5000);
//   // }

//   // function showNotif() {
//   //   document.querySelector('.notif').style.cssText = 'opacity: 1; z-index: 20';
//   // }
// });

function initializeCharacterSelect(array) {
  // set a limit on number of tips 
  let tipsNumber = array.length;
  // if (array.length > 10) {
  //   tipsNumber = 10;
  // }

  // take every tip string, split it into title and text
  for (let index = 0; index < tipsNumber; index++) {
    // let tipString = array[index];
    // let title = tipString.slice(0, tipString.indexOf(':'));
    // let text = tipString.slice(tipString.indexOf(':') + 2);


    setNotifContent(array[index], index);
  }
  
  setSliderIndicators(tipsNumber);

  setNotifEvents();
}

function setNotifContent(src, index) {
  let slider = document.querySelector('.notif__slider');

  // create notification slide and set it's position
  let notifSlide = document.createElement('div');
  notifSlide.classList.add('notif__slide');
  notifSlide.setAttribute('data-slide', index);
  notifSlide.style.left = index * 248 + 'px';

  let character = document.createElement('div');
  var myIcon = new Image();
  myIcon.src = src;

  character.appendChild(myIcon);

  // add slide to the DOM
  slider.appendChild(notifSlide);
  notifSlide.appendChild(character);

}

function setSliderIndicators(tipsNumber) {
  let indicatorsList = document.querySelector('.notif__indicators');

  // create every indicator and add it to DOM
  for (let index = 0; index < tipsNumber; index++) {
    let indicator = document.createElement('li');
    indicator.classList.add('indicator__item');
    indicator.setAttribute('data-slide', index);

    if (index === 0) {
     indicator.classList.add('indicator__item--active');
    }

    indicatorsList.appendChild(indicator);
  }
}

function setNotifEvents() {

  
  // set event listener to slider controls
  let sliderControls = document.querySelector('.notif__slider-controls');
  sliderControls.addEventListener('click', slide);

  //function removeNotifEvents() {
  //  sliderControls.removeEventListener('click', slide);
  //  notif.removeEventListener('keydown', slide);
  //  notif.removeEventListener('keydown', close);
  //  notif.removeEventListener('focus', listenKeyboard);
  //  checkbox.removeEventListener('change', disableTips);
  //  closeButton.removeEventListener('click', hideNotif);
  //} 
}

function slide(e) {

  let slider = document.querySelector('.notif__slider');
  let slides = [...slider.children];
  let indicatorsList = document.querySelector('.notif__indicators');
  let activeIndicator = document.querySelector('.indicator__item--active');
  let clickedButton = e.target;

  // PREVIOUS BUTTON
  // check if clicked button is 'previous button'
  if (clickedButton.classList.contains('notif__prev-button')) {

    // check if active indicator is the first one
    if (activeIndicator === indicatorsList.firstElementChild) {

      // make the last indicator active
      let lastIndicator = indicatorsList.lastElementChild;
      lastIndicator.classList.add('indicator__item--active');

      // switch to the last slide
      let lastSlideNumber = lastIndicator.getAttribute('data-slide');
      slides.forEach(slide => {
        slide.style.transform = 'translateX(' + lastSlideNumber * -248 + 'px)';
      });

    } else {
      // make previous indicator active
      let prevIndicator = activeIndicator.previousElementSibling;
      prevIndicator.classList.add('indicator__item--active');

      // switch to previous slide
      let prevSlideNumber = prevIndicator.getAttribute('data-slide');
      slides.forEach(slide => {
        slide.style.transform = 'translateX(' + prevSlideNumber * -248 + 'px)';
      });
    }

    activeIndicator.classList.remove('indicator__item--active');
  }

  // NEXT BUTTON
  // check if clicked button is 'next button'
  if (clickedButton.classList.contains('notif__next-button')) {

    //check if active indicator is the last one
    if (activeIndicator === indicatorsList.lastElementChild) {

      // make the first indicator active
      let firstIndicator = indicatorsList.firstElementChild;
      firstIndicator.classList.add('indicator__item--active');

      // switch to the first slide
      let firstSlideNumber = firstIndicator.getAttribute('data-slide');
      slides.forEach(slide => {
        slide.style.transform = 'translateX(' + firstSlideNumber * -248 + 'px)';
      });

    } else {

      // make next indicator active
      let nextIndicator = activeIndicator.nextElementSibling;
      nextIndicator.classList.add('indicator__item--active');

      // switch to the next slide
      let nextSlideNumber = nextIndicator.getAttribute('data-slide');
      slides.forEach(slide => {
        slide.style.transform = 'translateX(' + nextSlideNumber * -248 + 'px)';
      });
    }

    activeIndicator.classList.remove('indicator__item--active');
  }

  // SLIDER-INDICATOR
  // check if clicked button is 'slider-indicator'
  if (clickedButton.classList.contains('indicator__item')) {
    let indicator = clickedButton;
    let slideNumber = indicator.getAttribute('data-slide');
    let newActiveIndicator = document.querySelector('.indicator__item[data-slide = "'+slideNumber+'"]');

    // switch to selected slide
    slides.forEach(slide => {
      slide.style.transform = 'translateX(' + slideNumber * -248 + 'px)';
    });

    newActiveIndicator.classList.add('indicator__item--active');
    activeIndicator.classList.remove('indicator__item--active');
  }
}
