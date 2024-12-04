let spans = document.getElementsByClassName("span");
let input = document.querySelector(".switch")

input.addEventListener("click", (e) => {

    Array.from(spans).forEach((span) => {
        span.classList.toggle("hide");
    });
})