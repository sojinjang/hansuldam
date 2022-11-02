const carouselDot = document.querySelectorAll('.carousel-dot');

for (dot of carouselDot) {
	dot.addEventListener('click', carouselDotClicked);
}

function carouselDotClicked(e) {
	e.preventDefault();
	const slide = document.querySelector('.carousel-slide');
	const dot = document.querySelectorAll('.carousel-dot');

	dot.forEach((dot, i) => {
		if (dot === e.target) {
			slide.style.transform = `transLateX(-${i * 100}%)`;
		}
	});
}
