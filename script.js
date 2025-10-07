const slider = document.getElementById("slider");
const loader = document.getElementById("loader");
const dotsContainer = document.getElementById("dots");
const bgBlur = document.getElementById("bgBlur");
const progressBar = document.getElementById("progressBar");
const pauseBtn = document.getElementById("pauseBtn");

let slidesData = [];
let currentSlide = 0;
let interval;
let autoplay = true;
const autoplayTime = 5000;

const fetchImages = async () => {
  return [
    {url:"https://picsum.photos/id/1074/950/520",title:"The Sky Realm",desc:"Where clouds meet the peaks of imagination."},
    {url:"https://picsum.photos/id/1041/950/520",title:"Urban Mirage",desc:"Reflections of modern life captured in motion."},
    {url:"https://picsum.photos/id/1021/950/520",title:"Endless Sands",desc:"A timeless landscape shaped by whispers of the wind."},
    {url:"https://picsum.photos/id/1003/950/520",title:"The Wild Horizon",desc:"Adventure begins where the map fades away."}
  ];
};

const loadSlider = async () => {
  slidesData = await fetchImages();
  loader.style.display = "none";

  slidesData.forEach((slide, i) => {
    const slideDiv = document.createElement("div");
    slideDiv.classList.add("slide");
    slideDiv.innerHTML = `
      <img src="${slide.url}" alt="${slide.title}" />
      <div class="overlay">
        <h2>${slide.title}</h2>
        <p>${slide.desc}</p>
        <button>Explore</button>
      </div>`;
    slider.appendChild(slideDiv);

    const dot = document.createElement("span");
    dot.classList.add("dot");
    dot.addEventListener("click", ()=> showSlide(i));
    dotsContainer.appendChild(dot);
  });

  showSlide(0);
  if (autoplay) startAutoPlay();
  bgBlur.style.backgroundImage = `url(${slidesData[0].url})`;
};

const showSlide = (index)=>{
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  if(index>=slides.length) currentSlide=0;
  else if(index<0) currentSlide=slides.length-1;
  else currentSlide=index;

  slides.forEach((s,i)=>{
    s.classList.remove("active");
    dots[i].classList.remove("active");
  });

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
  slider.style.transform = `translateX(-${currentSlide*100}%)`;
  bgBlur.style.backgroundImage = `url(${slidesData[currentSlide].url})`;

  resetProgress();
};

const moveSlide = (n)=>{
  showSlide(currentSlide + n);
  resetProgress();
};

const startAutoPlay = ()=>{
  interval = setInterval(()=>moveSlide(1), autoplayTime);
  animateProgress();
};

const resetProgress = ()=>{
  progressBar.style.transition = "none";
  progressBar.style.width = "0";
  setTimeout(animateProgress,50);
};

const animateProgress = ()=>{
  progressBar.style.transition = `width ${autoplayTime}ms linear`;
  progressBar.style.width = "100%";
};

const togglePlay = ()=>{
  if(autoplay){
    clearInterval(interval);
    progressBar.style.transition = "none";
    pauseBtn.innerHTML = "&#9658;";
    autoplay=false;
  } else {
    autoplay=true;
    moveSlide(1);
    startAutoPlay();
    pauseBtn.innerHTML = "&#10074;&#10074;";
  }
};

pauseBtn.addEventListener("click", togglePlay);

// Swipe support
let startX=0;
slider.addEventListener("touchstart",(e)=> startX=e.touches[0].clientX);
slider.addEventListener("touchend",(e)=>{
  let endX = e.changedTouches[0].clientX;
  if(startX - endX > 50) moveSlide(1);
  else if(endX - startX > 50) moveSlide(-1);
});

loadSlider();
