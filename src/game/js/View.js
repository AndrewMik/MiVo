import $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/selectable';

export default class {
  constructor() {}

  showHeroes() {
    let heroContainer = $(".hero");
    let monsterContainer = $(".monster");
  
    heroContainer.addClass("hero--appear");
    monsterContainer.addClass("monster--appear");
  }

  setFullHealth() {
    $('.state__health-monster').width('100%');
    $('.state__health-hero').width('100%');
  }

  hideFightBox() {
    $(".fight-box").addClass("fight-box--collapse");
    setTimeout(() => {
      $(".fight-box").addClass("fight-box--hidden");
      $(".fight-box").removeClass("fight-box--collapse");
    }, 1000);
  }

  showFightBox() {
    $(".fight-box").removeClass("fight-box--hidden");
    $('.fight-box__text').addClass('fight-box__text--slide');
  }

  setHeroName(heroName) {
    let hero = $(".state__name--hero");
    hero.text(heroName);
  }

  setMonsterName(monsterName) {
    let monster = $(".state__name--monster");
    monster.text(monsterName);
  }

  setLevel(level) {
    $(".level__num").text(level);
  }

  toggleElementVisibility(element) {
    element.toggleClass('element--hidden');
  }

  initCharacterSelectField() {
    let characterSelect = $(".character-select");
    let partSelect = $(".part-select"); 
       
    let roleSliders = $(".role__slider");
    
    roleSliders.each((index, slider) => {      
      this.setParts($(slider), 13, index);
    });
  
    partSelect.each((index, slider) => {
      this.setSliderEvents($(slider));
    });
  }

  setParts(slider, sources, index) {
    for (let i = 0; i < sources; i++) {

      let partSlide = $("<div>")
      .addClass("role__slide")
      .attr("data-slide", i)
      .css('left', i * 267 + "px");
  
      let character = $("<div>")
      .addClass("slide__img")
      .css('backgroundPosition', (i + 1) * 267 + "px 0");
  
      if (i === 0) {
        partSlide.addClass("role__slide--active");
      }
  
      slider.append(partSlide);
      partSlide.append(character);
    }
  }

  setSliderEvents(slider) {
    // TODO: add listeners for keyboard  
    slider.on("click", this.slide);
  }

  slide(e) {
    let slider = $(this);
    
    let slidesList = $(".role__slider");
    let slides = slidesList.children();
    
    let activeSlide = $(".role__slide--active");
    let clickedButton = $(e.target);
    
    // PREVIOUS BUTTON
    // check if clicked button is 'previous button'
    if (clickedButton.hasClass("role__prev") || clickedButton.hasClass("role__prev-button")) {
      // check if active indicator is the first one

      if (activeSlide[0] === slides.first()[0]) {       
        // make the last slide active
        let lastSlide = slides.last()
        .addClass("role__slide--active");
  
        // switch to the last slide
        let lastSlideNumber = lastSlide.attr("data-slide");
        slides.each((index, slide) => {
          $(slide).css("transform", 'translateX(' + lastSlideNumber * -267 + "px)");
        });
      } else {
        // make previous indicator active
        let prevSlide = activeSlide.prev()
        .addClass("role__slide--active");
  
        // switch to previous slide
        let prevSlideNumber = prevSlide.attr("data-slide");
        slides.each((index, slide) => {
          $(slide).css("transform", "translateX(" + prevSlideNumber * -267 + "px)");
        });
      }
  
      activeSlide.removeClass("role__slide--active");
    }
  
    // NEXT BUTTON
    // check if clicked button is 'next button'
    if (clickedButton.hasClass("role__next") || clickedButton.hasClass("role__next-button")) {
      //check if active indicator is the last one
      if (activeSlide[0] === slides.last()[0]) {
        // make the first indicator active
        let firstSlide = slides.first()
        .addClass("role__slide--active");
  
        // switch to the first slide
        let firstSlideNumber = firstSlide.attr("data-slide");
        slides.each((index, slide) => {
          $(slide).css("transform", "translateX(" + firstSlideNumber * -267 + "px)");
        });
      } else {
        // make next indicator active
        let nextSlide = activeSlide.next()
        .addClass("role__slide--active");
  
        // switch to the next slide
        let nextSlideNumber = nextSlide.attr("data-slide");
        slides.each((index, slide) => {
          $(slide).css("transform", "translateX(" + nextSlideNumber * -267 + "px)");
        });
      }
  
      activeSlide.removeClass("role__slide--active");
    }
  }
  
  checkModalChooseSpellClicked() {

    let modalChooseSpell = $('#choose-spell');
    let modalContentChooseSpell = $('#choose-spell-content');
    let eventTarget = event.target;
    let isModalContentClicked = false;
  
    while (eventTarget !== document.body) {
      if ( eventTarget === modalContentChooseSpell[0] ) {
        isModalContentClicked = true;
      }
      eventTarget = eventTarget.parentElement;
    }
  
    if (!isModalContentClicked) {
      modalChooseSpell.toggleClass("element--hidden");
    }
  }

  closeTask(taskElement, eventHandlerFunction) {  
    taskElement.off('submit', eventHandlerFunction);
    this.toggleElementVisibility($('#task'));
  }

  setHealthZero(healthBar){
    healthBar.width('0%');
  }

  getWidth(element) {
    let width = element.width();    
    let parentWidth = element.parent().width();  
    return Math.floor(100 * width / parentWidth);
  }

  reduceHealth(healthBar, damage){
    let healthAfterHit = Number.parseInt(this.getWidth(healthBar)) - damage;
    if (healthAfterHit <= 0) {
      this.setHealthZero(healthBar);
    } else {
      healthBar.width(healthAfterHit + "%");
    }
  }

  clearContainer(container) {

    if(container.children()){
      container.children().remove();
    }
    
    if (container.hasClass('task__condition')) {
      container.removeClass (function (index, className) {
        return (className.match (/(^|\s)task__condition--\S+/g) || []).join(' ');
      });   
    }
  }

  appendCondition(taskForm, conditions) {
    conditions.forEach( condition => {
      if (typeof condition !== 'object') {
        let conditionElement = $('<p>')
        .text(condition);  
        taskForm.append(conditionElement);
      } else {
        taskForm.append(condition);
      }
    });
  }

  getTaskForm() {
    return $('.task');
  }

  getCondContainer() {
    return $('.task__condition');
  }

  createInputForAnswer() {  
    let userInput = $('<input>')
    .addClass('task__input')
    .attr({
      placeholder: "Ответ",
      autofocus: true,
      autocomplete: "off",
      type: "text"
    });
  
    return userInput;
  }

  showTaskMessage(textToDisplay) {
    $('#task-todo-message').text(textToDisplay);
  }

  showHeroMessage(message, milliseconds) {
    message = message || `Привет, ${$(".state__name--monster").text().split(" ")[2]}!`;
    this.showMessage("hero", message, milliseconds);
  }

  showMonsterMessage(message, milliseconds) {
    message = message || `Привет, ${$(".state__name--hero").text() ? $(".state__name--hero").text() : "чужестранец"}!`;
    this.showMessage("monster", message, milliseconds);
  }

  showMessage(talker, message, milliseconds) {
    milliseconds = milliseconds || 2000;
  
    $(`.dialogue__${talker}`).removeClass("dialogue--hidden");
    $(`.dialogue__${talker}-message`).html(message);
    setTimeout(() => {
       $(`.dialogue__${talker}`).addClass("dialogue--hidden");
    }, milliseconds);
  }

  castSpell(spellName) {
    let spell = $("<div>")
    .addClass(spellName);
    
    $('body').append(spell);
  
    setTimeout(() => {
      spell.remove();
    }, 5000);
  
    
    let animationDuration = getComputedStyle(spell[0]).animationDuration;
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