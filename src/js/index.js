import '../css/style.css';

const playButton = document.querySelector('.button-play');
playButton.addEventListener('click', loadGame);

// Temporary loads the game
// TODO: Remove in last version
document.addEventListener('DOMContentLoaded', loadGame);

function loadGame() {
  hideLandingPage();
  showGameField();
  registerPlayer();
}

function startGame(char) {
  let character = characters[0][char];
  
  let canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

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
  player.setAttribute('src', './src/img/' + character);

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
  form.classList.toggle('register-form--hidden');
}



function registerPlayer() {
  showRegisterField(); 
  initCharacterSelectField();
  let login;
  let mail;
  let char;

  let form = document.querySelector('.register-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    login = document.getElementById('login').value;
    mail = document.getElementById('email').value;
    char = document.querySelector('.role__slide--active').getAttribute('data-slide');
    showRegisterField();
    startGame(char);
  });
}

// this array can be used to make character consist of several parts
// you have to add in array below array of sources to images
// that will be different variants of a body part
// you also have to duplicate .part-select element in index.html
let characters = [
  ['char1.gif',
  'char2.gif',
  'char3.gif']
];


function initCharacterSelectField() {

  let characterSelect = document.querySelector('.character-select');  
  let partSelect = [...document.querySelectorAll('.part-select')]; 
  let roleSliders = [...document.querySelectorAll('.role__slider')];
  
  roleSliders.forEach((slider, index) => {
    setParts(slider, characters[index], index);
  });
  
  partSelect.forEach((slider) => {
    setSliderEvents(slider);
  });
 
}

function setParts(slider, sources, index) {

  for (let i = 0; i < sources.length; i++) {
    let partSlide = document.createElement('div');
    partSlide.classList.add('role__slide');
    partSlide.setAttribute('data-slide', i);
    partSlide.style.left = i * 248 + 'px';
  
    let character = document.createElement('img');
    character.setAttribute('src', './src/img/'+ sources[i]);

    if (i === 0) {
      partSlide.classList.add('role__slide--active');
     }
  
    slider.appendChild(partSlide);
    partSlide.appendChild(character);  
  }
}

function setSliderEvents(slider) {
  // TODO: add listeners for keyboard
  slider.addEventListener('click', slide);
}

function slide(e) {

  let slider = this;
  let slides = [...(slider.querySelector('.role__slider')).children];
  
  let slidesList = slider.querySelector('.role__slider');
  let activeSlide = slider.querySelector('.role__slide--active');
  
  let clickedButton = e.target;

  // PREVIOUS BUTTON
  // check if clicked button is 'previous button'
  if (clickedButton.classList.contains('role__prev-button')) {    

    // check if active indicator is the first one
    if (activeSlide === slidesList.firstElementChild) {
      
      // make the last slide active
      let lastSlide = slidesList.lastElementChild;
      lastSlide.classList.add('role__slide--active');

      // switch to the last slide
      let lastSlideNumber = lastSlide.getAttribute('data-slide');
      slides.forEach(slide => {
        slide.style.transform = 'translateX(' + lastSlideNumber * -248 + 'px)';
      });

    } else {
      // make previous indicator active
      let prevSlide = activeSlide.previousElementSibling;
      prevSlide.classList.add('role__slide--active');

      // switch to previous slide
      let prevSlideNumber = prevSlide.getAttribute('data-slide');
      slides.forEach(slide => {
        slide.style.transform = 'translateX(' + prevSlideNumber * -248 + 'px)';
      });
    }

    activeSlide.classList.remove('role__slide--active');
  }

  // NEXT BUTTON
  // check if clicked button is 'next button'
  if (clickedButton.classList.contains('role__next-button')) {

    //check if active indicator is the last one
    if (activeSlide === slidesList.lastElementChild) {

      // make the first indicator active
      let firstSlide = slidesList.firstElementChild;
      firstSlide.classList.add('role__slide--active');

      // switch to the first slide
      let firstSlideNumber = firstSlide.getAttribute('data-slide');
      slides.forEach(slide => {
        slide.style.transform = 'translateX(' + firstSlideNumber * -248 + 'px)';
      });

    } else {

      // make next indicator active
      let nextSlide = activeSlide.nextElementSibling;
      nextSlide.classList.add('role__slide--active');

      // switch to the next slide
      let nextSlideNumber = nextSlide.getAttribute('data-slide');
      slides.forEach(slide => {
        slide.style.transform = 'translateX(' + nextSlideNumber * -248 + 'px)';
      });
    }

    activeSlide.classList.remove('role__slide--active');
  }
}
