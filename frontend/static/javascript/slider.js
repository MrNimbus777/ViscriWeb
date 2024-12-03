const images = document.querySelectorAll("section.slider > div img");
const prev_button = document.querySelector(".prev_btn")
const next_button = document.querySelector(".next_btn")

let counter = 1;


function showImage(index){
    images.forEach(e => e.classList.remove("prev", "current", "next"));
    images[(index-1+images.length)%images.length].classList.add("prev");
    images[index%images.length].classList.add("current");
    images[(index+1)%images.length].classList.add("next");
}

let slide = true;

prev_button.addEventListener('click', () => {
    counter--;
    if(counter <= 0) {
        counter = images.length;
    }
    showImage(counter);
    slide = false;
});
next_button.addEventListener('click', () => {
    counter++;
    if (counter >= images.length) {
        counter = 0;
    }
    showImage(counter);
    slide = false;
});

setInterval(() => {
    if(slide){
        counter++;
        if (counter >= images.length) {
        counter = 0;
        }
        showImage(counter);
    } else slide = true;
}, 3000);