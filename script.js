'use strict';

//Element Selecting:
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
//'querySelectorAll' because there's two buttons to open an account aka open the modal window, so btnOpenModal os a nodeList here.
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
//Select the button and the section you wanna scroll to:
const btn_scroll_to = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabs_container = document.querySelector ('.operations__tab-container');
const tabs_content = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Modal window
//Opening:
const openModal = function (e) {
  /*If we click on 'open account' page scrolls back to top, because it's a link and not a button.
  href='#' in html file is a default thing that we used. 
  to prevent the default we simply do e.preventDefault in the handler function. */
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click' , openModal));
//Closing:
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
//1.By clicking on the close button:
btnCloseModal.addEventListener('click', closeModal);
//2.By clicking anywhere out of the modal window:
overlay.addEventListener('click', closeModal);
//3.By pressing the escape button:
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});



//Smooth scrolling -for the learn more button-
btn_scroll_to.addEventListener('click' , function(e) {
  //METHOD #1
  //Get the coordinats of the elemet that we want to scroll to.
  //1.
  const s1_coords = section1.getBoundingClientRect();
  //2. Better:
  //target == btn_scroll_to
  //Relative to the visible view point
  console.log(e.target.getBoundingClientRect());  //x:from border of the browser.  y:distance from the top.
  //Current scroll:
  console.log(window.pageXOffset , window.pageYOffset);
  //Height and weight :
  console.log(document.documentElement.clientHeight , document.documentElement.clientWidth);
  //Scrolling:
  //FIXME I understand nothing.
  // window.scrollTo(s1_coords.left+window.pageXOffset , s1_coords.top+window.pageYOffset);
  //Smoothly:
  window.scrollTo({
    left : s1_coords.left+window.pageXOffset , 
    top: s1_coords.top+window.pageYOffset ,
    behavior: 'smooth'
  });

  //METHOD #2
  section1.scrollIntoView({behavior: 'smooth'});
});



//Smooth scrolling bahavior in the navigation: Using event bubbling implementing event delegation:
//1. Add event-listener to common parent element
//2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click' , function(e) {
  e.preventDefault();
  /* The parent element is the one with 'nav__links' class but the problem is we only want the scrolling 
  to happen when clicking on one of the buttons in the nav bar NOT ANYWHERE IN IT. So we need an strategy.*/
  //Matching Strategy: (here check if the target element contains the class that we are interested in.)
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');   //We dont want the absolute url so not 'this.href'.
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    };
   });
//OPTIMIZE D by Using event delegation.
// //First selecting all of the three links:
// document.querySelectorAll('.nav__link').forEach(function(el) {
//     el.addEventListener('click' , function(e) {
//     //Preventing from jumping to its section in the page:
//     e.preventDefault();
//     //Without wanting to scroll smoothly, we would automatically jump to a section because of anchoring in html.
//     //Smooth Scrolling:
//     const id = this.getAttribute('href');   //We dont want the absolute url so not 'this.href'.
//     //Selecting the element we wanna scroll to.
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//     });
//     /* This above works fine but we are adding the exact same callback function to
//     each of the three elements which is unnecessary.
//     The better solution is event-delegation.
//     We put the event-listener on a common parent of all the elements that we want.
//     The container that has all the three links. */
// });



//Tabbed Component: the section is called 'operations' 
/*What we wanna get is that whenever we click on one of the tabs, its corresponding content comes up. 
So on the tabs array we could call the event-listener and add a callback function whenever clicked.
But what if we had 2000 of them? it would be inefficient. Cause we would have 2000 copies of the callback functin
SO, event-delegation:*/
//Attaching the event handler to a common parent:
tabs_container.addEventListener('click' , function(e) {
  /*We need to figure out which button was clicked to know its data attribute. e.target gives what element was clicked on.
  But since there's another element in the 'button' element, 'span', if we click on the number,
  e.target will give us the span and not the button.
  What if we find the parent element? then we would get the parent when we click on the button itself, too.
  We need to select a button element that is always a tab. Use closest:*/
  //Find the closest parent with that class name and it may be itself.
  const clicked = e.target.closest('.operations__tab');
  /*We get null as the result of 'e.target.closest('.operations__tab')' when we click anywhere on container 
  exexpt for the tab buttons. So we gotta ignore all the clicks on that area.*/
  //Gaurd Clause
  if (!clicked) return;
  //Deactivate tab and content:
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabs_content.forEach(c => c.classList.remove('operations__content--active'));
  //Activate tab:
  clicked.classList.add('operations__tab--active');
  //Activate content area:
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});



//Menu fade animation:
const handle_hover  = function (e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    /*Select the siblings --> go upwards and find the parent's children --> every 'nav__link' is in a separate
    'nav__item' --> go upwards TWICE/use closest. */
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    //All the links exept for the one that is hovered.
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
   };
};
//The handler functin can only take one argument. //FIXME we dont need the opacity as one of the input arguments in the func definition, why?
//Fading when hovered:
nav.addEventListener('mouseover' , handle_hover.bind(0.5));
//Go back to normal:
nav.addEventListener('mouseout' , handle_hover.bind(1));
//OPTIMIZE d by using the bind method.
// //Fading when hovered:
// //FIXME wtf?
// nav.addEventListener('mouseover' , function(e) { handle_hover(e , 0.5) });
// //Go back to normal:
// nav.addEventListener('mouseout' , function(e) { handle_hover(e , 1) });
//OPTIMIZE d into handle_hover function.
// //Finding the common parent element of all the links plus the logo: 'nav'.
// //mouseover is the same as mouseenter but mouseenter does not bubble and we need the event to bubble.
// //opposite of mouseenter in mouseleave     //opposite of mouseover is mouseout.
// nav.addEventListener('mouseover' , function(e) {
//   //check if event happened in the right place:
//   /*The links in the nav bar have no child element like the links from tab components(the span thing) 
//   so there's no need to use the closest method.*/
//   if(e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     /*Select the siblings --> go upwards and find the parent's children --> every 'nav__link' is in a separate
//     'nav__item' --> go upwards TWICE/use closest. */
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');
//     //All the links exept for the one that is hovered.
//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity =0.5;
//     });
//     logo.style.opacity = 0.5;
//   }
// });
// //Undo the fading:
// nav.addEventListener('mouseout' , function(e) {
//   if(e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     /*Select the siblings --> go upwards and find the parent's children --> every 'nav__link' is in a separate
//     'nav__item' --> go upwards TWICE/use closest. */
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');
//     //All the links exept for the one that is hovered.
//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity =1;
//     });
//     logo.style.opacity = 1;
//   }
// });



//Sticky Navigation:
//When do we want our nav bar to be sticky? when the header moves completely out of the view.
const header = document.querySelector('.header');
const nav_height = nav.getBoundingClientRect().height;
const sticky_nav = function(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}
const header_obs = new IntersectionObserver(sticky_nav , {
  root: null,
  threshold: 0,
  //root margin: a box of pixles that will be applied outside of our target element-header-.
  rootMargin: `-${nav_height}px`,   //the height of the nav bar is 90px.
});
header_obs.observe(header);
//OPTIMIZE d by Intersectional Observer API
// //Finding where the section 1 begins, (the first page ends.)
// const initial_coord = section1.getBoundingClientRect();
// window.addEventListener('scroll' , function() {
//   //As the scroll reaches to the beginning of the first section 1.
//   //FIXME what is this sticky class?
//   if(window.scrollY > initial_coord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });



//Revealing elements on scroll:
//All the sections by default have the 'hidden' attribute -we add them:D-
const all_sections = document.querySelectorAll('.section');
const reveal_section = function(entries , observer) {
  const [entry] = entries; 
  if(!entry.isIntersecting) return;  
  entry.target.classList.remove('section--hidden');
  //Observe once  //efficiency
  observer.unobserve(entry.target);
};
const section_obs = new IntersectionObserver(reveal_section , {
  root: null,
  threshold: 0.15,  
});
all_sections.forEach(function (section) {
  section_obs.observe(section);
  //Hide all the sections:
  section.classList.add('section--hidden');
});




//Lazy Loading: as we approach the image, the one with low resolution replaces with the one with high resolution.
//Select all the images which have the property of data-src.(data-src is the othe img with high quality)
const img_targets = document.querySelectorAll('img[data-src]');
const load_img = function(entries , observer) {
  //One threshold so one entry
  const [entry] = entries;
  if(!entry.isIntersecting) return;   //FIXME what is this?
  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //Removing the blur effect once the imgs are loaded:
  entry.target.addEventListener('load' , function() {
    entry.target.classList.remove('lazy-img');
  //Unobserving:
  observer.unobserve(entry.target);
  });
}
const img_obs = new IntersectionObserver(load_img , {
  root: null,
  threshold: 0,
  //loading the imgs a bit earlier so it would seem like the lazy loading is in the backgound.
  rootMargin: '200px'
});
//We created an observer and tell it to do sth whenever you observed one of these imgs.
img_targets.forEach(img => img_obs.observe(img));



//Slider
const slider = function() {
  const slides = document.querySelectorAll('.slide');
  const btn_left = document.querySelector('.slider__btn--left');
  const btn_right = document.querySelector('.slider__btn--right');
  const dot_container = document.querySelector('.dots');

  let cur_slide = 0;
  const max_slide = slides.length;

  //Function for creating dots for each slide:
  const create_dots = function() {
    slides.forEach(function (_ , i) {
      dot_container.insertAdjacentHTML('beforeend' , `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };
  //Activate dot:
  const activate_dot = function(slide) {
    //Before we active one of them deactivate all of them:
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    //Turn on the active slide's dot:
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };
  //Activate the first dot in the beginning:

  //FIXME CSS
  //First all the slides(imgs) are at the same positins. we create an starting position in which the images are next to each other.
  //0 , 100 , 200 , 300 //OPTIMIZE === go_to_slide(0)
  // slides.forEach((s , i) => (s.style.transform = `translateX(${100*i}%)`));
  const go_to_slide = function(slide) {
    slides.forEach((s , i) => (s.style.transform = `translateX(${100*(i-slide)}%)`));
  };
  // //Seeing the img better.
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.3) translateX(-1200px)';
  // slider.style.overflow = 'visible';
  //Go to next slide(right btn)
  const next_slide = function () {
    if (cur_slide === max_slide - 1)  cur_slide = 0;
    else  cur_slide++;
    go_to_slide(cur_slide);
    activate_dot(cur_slide);
  };
  //Go to prev slide(left btn)
  const prev_slide = function () {
    if (cur_slide === 0)  cur_slide = max_slide - 1;
    else  cur_slide--;
    go_to_slide(cur_slide);
    activate_dot(cur_slide);
  };
  //Initial function:
  const init = function() {
    create_dots();
    activate_dot(0);
    go_to_slide(0);
  };
  init();
  //Event-handlers: 
  btn_right.addEventListener('click' , next_slide);
  btn_left.addEventListener('click' , prev_slide);

  //Slide with keyboard arrow keys:
  document.addEventListener('keydown' , function(e) {
    if(e.key === 'ArrowLeft') prev_slide();
    e.key === 'ArrowRight' && next_slide();
  });

  //Handling dots wit event delegation:
  dot_container.addEventListener('click' , function(e) {
    if(e.target.classList.contains('dots__dot')) {
      //Read the number of dot aka number of slide:
      const {slide} = e.target.dataset;
      go_to_slide(slide);
      cur_slide = slide;
      activate_dot(cur_slide);
    };
  });
};
slider();


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





