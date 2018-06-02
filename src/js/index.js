import '../css/style.css';

const playButton = document.querySelector('.button-play');
playButton.addEventListener('click', loadGame);

loadGame();

function loadGame() {
  document.body.innerHTML = '';

  const canvas = document.createElement('canvas');
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