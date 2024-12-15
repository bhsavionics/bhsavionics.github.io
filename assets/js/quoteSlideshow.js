let slideIndexQuotes = 1;
showSlidesQuotes(slideIndexQuotes);

function plusSlidesQuotes(n) {
    showSlidesQuotes(slideIndexQuotes += n);
}

function currentSlideQuotes(n) {
    showSlidesQuotes(slideIndexQuotes = n);
}

function showSlidesQuotes(n) {
    let i;
    let slides = document.getElementsByClassName("myQuotes");
    if (n > slides.length) {
        slideIndexQuotes = 1;
    }
    if (n < 1) {
        slideIndexQuotes = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndexQuotes - 1].style.display = "block";
}