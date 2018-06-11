const METEORITE = 'meteorite';
const FIST_HERO = 'fist-hero';
const FIST_MONSTER = 'fist-monster';
import $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/selectable';

export default class {
  constructor() {

  }

  showHeroes() {
    let heroContainer = document.querySelector(".hero");
    let monsterContainer = document.querySelector(".monster");
  
    heroContainer.classList.add("hero--appear");
    monsterContainer.classList.add("monster--appear");
  }

  setFullHealth() {
    document.querySelector('.state__health-monster').style.width = 100 + '%';
    document.querySelector('.state__health-hero').style.width = 100 + '%';
  }

  hideFightBox() {
    document.querySelector(".fight-box").classList.add("fight-box--collapse");
    setTimeout(() => {
      document.querySelector(".fight-box").classList.add("fight-box--hidden");
      document.querySelector(".fight-box").classList.remove("fight-box--collapse");
    }, 1000);
  }

  showFightBox() {
    document.querySelector(".fight-box").classList.remove("fight-box--hidden");
    document.querySelector('.fight-box__text').classList.add('fight-box__text--slide');
  }

  setHeroName(heroName) {
    let hero = document.querySelector(".state__name--hero");
    hero.innerText = heroName;
  }

  setMonsterName(monsterName) {
    let monster = document.querySelector(".state__name--monster");
    monster.innerText = monsterName;
  }

  setLevel(level) {
    document.querySelector(".level__num").innerText = level;
  }

  toggleElementVisibility(element) {
    element.classList.toggle('element--hidden');
  }

  initCharacterSelectField() {
    let characterSelect = document.querySelector(".character-select");
    let partSelect = [...document.querySelectorAll(".part-select")];
    let roleSliders = [...document.querySelectorAll(".role__slider")];
  
    roleSliders.forEach((slider, index) => {
      this.setParts(slider, 13, index);
    });
  
    partSelect.forEach(slider => {
      this.setSliderEvents(slider);
    });
  }

  setParts(slider, sources, index) {
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

  setSliderEvents(slider) {
    // TODO: add listeners for keyboard
    slider.addEventListener("click", this.slide);
  }

  slide(e) {
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
  
  checkModalChooseSpellClicked() {
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
      modalChooseSpell.classList.toggle("element--hidden");
    }
  }

  closeTask(taskElement, eventHandlerFunction) {  
    taskElement.removeEventListener('submit', eventHandlerFunction);
    this.toggleElementVisibility(document.getElementById('task'));
  }

  setHealthZero(healthBar){
    healthBar.style.width = '0%';
  }

  reduceHealth(healthBar, damage){
    healthBar.style.width = Number.parseInt(healthBar.style.width) - damage + "%";
  }

  clearContainer(container) {
    while(container.firstElementChild) {
      container.removeChild(container.firstElementChild);
    }
  }

  appendCondition(taskForm, conditions) {
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

  getTaskForm() {
    return document.querySelector('.task');
  }

  getCondContainer() {
    return document.querySelector('.task__condition');
  }

  createInputForAnswer(taskName) {  
    let userInput = document.createElement('input');
  
    userInput.type = "text";
    userInput.classList.add('task__input');
    userInput.placeholder = "Ответ";
    userInput.autofocus = true;
    //userInput.maxLength = answerLength;
    userInput.autocomplete = "off";
  
    if(taskName) {
      userInput.classList.add('task__' + taskName);
    }
  
    return userInput;
  }

  showTaskMessage(textToDisplay) {
    let taskMessage = document.getElementById('task-todo-message');
    taskMessage.innerText = textToDisplay;
  }

  showHeroMessage(message, milliseconds) {
    message = message || "Я есть Грут!";
    milliseconds = milliseconds || 2000;
  
    document.querySelector(".dialogue__hero").classList.remove("dialogue--hidden");
    document.querySelector(".dialogue__hero-message").innerHTML = message;
    setTimeout(() => {
       document.querySelector(".dialogue__hero").classList.add("dialogue--hidden");
    }, milliseconds);
  }

  showMonsterMessage(message, milliseconds) {
    message = message || "Ты есть грунт!!!";
    milliseconds = milliseconds || 2000;
  
    document.querySelector(".dialogue__monster").classList.remove("dialogue--hidden");
    document.querySelector(".dialogue__monster-message").innerHTML = message;
    setTimeout(() => {
       document.querySelector(".dialogue__monster").classList.add("dialogue--hidden");
    }, milliseconds);
  }

  castSpell(spellName = FIST_HERO) {
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

  toggleSortable(isSortable) {
    isSortable 
    ? $(".task__condition").sortable("enable")
    : $(".task__condition").sortable("disable") ;
  }
  
  toggleSelectable(isSelectable) {
    isSelectable
    ? $(".task__condition").selectable("enable")
    : $(".task__condition").selectable("disable");
  }

}