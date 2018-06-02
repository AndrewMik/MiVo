import '../css/style.css';
import Icon from '../img/battlefield.jpg';

let playButton = document.querySelector('.button-play');
playButton.addEventListener('click', loadGame);

function loadGame() {
  document.body.innerHTML = '';
  let canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let c = canvas.getContext('2d');
  // canvas.style.backgroundImage = 'url(' + Icon + ')';
}