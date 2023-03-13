const slides = [
	{
		id: 1,
		image: "../../img/projet/Refonte MMI/personna1.png",
	},
	{
		id: 2,
		image: "../../img/projet/Refonte MMI/personna2.png",
	},
	{
		id: 2,
		image: "../../img/projet/Refonte MMI/personna3.png",
	},
];

const amt = 100 / slides.length;
const slider = document.querySelector(".slider");

let value = 0;
let indicatorsValue = 0;
let interval = 8000;

let indicators;
let start;

loadSlides();

async function loadSlides() {
	await createSlides();
	await createIndicators();

	start = setInterval(() => slide("increase"), interval);

	document.querySelectorAll(".navigation").forEach((cur) => {
		cur.addEventListener("click", () =>
			cur.classList.contains("next") ? slide("increase") : slide("decrease")
		);
	});

	indicators.forEach((cur) =>
		cur.addEventListener("click", (ev) => clickCheck(ev))
	);

	const touchSlide = (() => {
		let start, move, change, sliderWidth;

		slider.addEventListener("touchstart", (e) => {
			start = e.touches[0].clientX;
			sliderWidth = slider.clientWidth / indicators.length;
		});

		slider.addEventListener("touchmove", (e) => {
			e.preventDefault();
			move = e.touches[0].clientX;
			change = start - move;
		});

		const mobile = (e) => {
			change > sliderWidth / 4 ? slide("increase") : null;
			change * -1 > sliderWidth / 4 ? slide("decrease") : null;
			[start, move, change, sliderWidth] = [0, 0, 0, 0];
		};
		slider.addEventListener("touchend", mobile);
	})();
}

//Create slides from JSON object "slides"
function createSlides() {
	for (let i = 0; i < slides.length; i++) {
		const slide = document.createElement("div");
		slide.classList.add("slider__slide");
		slide.innerHTML = `<img src="${slides[i].image}" class="slider__slide__image"><div class="slider__slide__details"></div>`;
		document.querySelector(".slider").appendChild(slide);
	}
}

//Create indicators based on the number of slides
function createIndicators() {
	for (let i = 0; i < slides.length; i++) {
		const box = document.createElement("div");
		box.setAttribute("data-index", i);
		document.querySelector(".indicators").appendChild(box);
	}
	indicators = document.querySelector(".indicators").querySelectorAll("div");
	indicators[0].classList.add("active");
	document.querySelector(":root").style.setProperty("--index", slides.length);
}

// Transition du slider 
function move(S, T) {
	slider.style.transform = `translateX(-${S}%)`;
	indicators[T].classList.add("active");
}

// Check which indicator was clicked
function clickCheck(e) {
	clearInterval(start);
	indicators.forEach((cur) => cur.classList.remove("active"));
	const check = e.target;
	check.classList.add("active");

	value = check.getAttribute("data-index") * amt;

	indicatorsUpdate();
	move(value, indicatorsValue);
	start = setInterval(() => slide("increase"), interval);
}

function indicatorsUpdate() {
	indicatorsValue = value / amt;
}

function slide(condition) {
	clearInterval(start);
	condition === "increase" ? slideIncrease() : slideDecrease();
	move(value, indicatorsValue);
	start = setInterval(() => slide("increase"), interval);
}

function slideIncrease() {
	indicators.forEach((cur) => cur.classList.remove("active"));
	value === (document.querySelectorAll(".slider__slide").length - 1) * amt
		? (value = 0)
		: (value += amt);
	indicatorsUpdate();
}

function slideDecrease() {
	indicators.forEach((cur) => cur.classList.remove("active"));
	value === 0
		? (value = (document.querySelectorAll(".slider__slide").length - 1) * amt)
		: (value -= amt);
	indicatorsUpdate();
}