document.addEventListener('DOMContentLoaded', () => {
	let slider = document.querySelector('.slideshow-main');
	let slides = slider.querySelectorAll('.slide');
	let arrows = slider.querySelector('.slideshow-arrows');
	let sliderTrack = slider.querySelector('.slideshow-track');
	let sliderList = slider.querySelector('.slideshow-list');
	var slideWidth = slides[0].offsetWidth;
	var posThreshold = slides[0].offsetWidth * 0.35;
	var lastTrf = --slides.length * slideWidth;
	window.addEventListener('resize', () => {
		slideWidth = slides[0].offsetWidth;
		posThreshold = slides[0].offsetWidth * 0.35;
		lastTrf = --slides.length * slideWidth;
	}, true);
	let next = arrows.children[1];
	let prev = arrows.children[0];
	let slideIndex = 0,
		posInit = 0,
		posX1 = 0,
		posX2 = 0,
		posY1 = 0,
		posY2 = 0,
		posFinal = 0,
		isSwipe = false,
		isScroll = false,
		allowSwipe = true,
		transition = true,
		nextTrf = 0,
		prevTrf = 0,
		trfRegExp = /([-0-9.]+(?=px))/,
		swipeStartTime,
		swipeEndTime,
		getEvent = function () {
			return (event.type.search('touch') !== -1) ? event.touches[0] : event;
		},
		slide = function () {
			if (transition) {
				sliderTrack.style.transition = 'transform .5s';
			}
			sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;
			window.addEventListener('resize', () => {
				sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;
			}, true);

			prev.classList.toggle('disabled', slideIndex === 0);
			next.classList.toggle('disabled', slideIndex === --slides.length);

			if (slideIndex == 0) {
				prev.classList.add('disabled');
			}
			if (window.innerWidth > 992) {
				if (slideIndex == --slides.length - 1) {
					next.classList.add('disabled');
				}
			} else {
				if (slideIndex == --slides.length) {
					next.classList.add('disabled');
				}
			}
			window.addEventListener('resize', () => {
				if (window.innerWidth > 992) {
					if (slideIndex == --slides.length - 1) {
						next.classList.add('disabled');
					}
				} else {
					if (slideIndex == --slides.length) {
						next.classList.add('disabled');
					}
				}
			});
		},
		swipeStart = function () {
			let evt = getEvent();

			if (allowSwipe) {

				swipeStartTime = Date.now();

				transition = true;

				nextTrf = (slideIndex + 1) * -slideWidth;
				prevTrf = (slideIndex - 1) * -slideWidth;

				posInit = posX1 = evt.clientX;
				posY1 = evt.clientY;

				sliderTrack.style.transition = '';

				document.addEventListener('touchmove', swipeAction);
				document.addEventListener('mousemove', swipeAction);
				document.addEventListener('touchend', swipeEnd);
				document.addEventListener('mouseup', swipeEnd);

				sliderList.classList.remove('grab');
				sliderList.classList.add('grabbing');
			}
		},
		swipeAction = function () {

			let evt = getEvent(),
				style = sliderTrack.style.transform,
				transform = +style.match(trfRegExp)[0];

			posX2 = posX1 - evt.clientX;
			posX1 = evt.clientX;

			posY2 = posY1 - evt.clientY;
			posY1 = evt.clientY;

			if (!isSwipe && !isScroll) {
				let posY = Math.abs(posY2);
				if (posY > 7 || posX2 === 0) {
					isScroll = true;
					allowSwipe = false;
				} else if (posY < 7) {
					isSwipe = true;
				}
			}

			if (isSwipe) {
				if (slideIndex === 0) {
					if (posInit < posX1) {
						setTransform(transform, 0);
						return;
					} else {
						allowSwipe = true;
					}
				}
				// tut
				if (window.innerWidth > 992) {
					if (slideIndex + 1 === --slides.length) {
						if (posInit > posX1) {
							setTransform(transform, lastTrf);
							return;
						} else {
							allowSwipe = true;
						}
					}
				} else {
					if (slideIndex === --slides.length) {
						if (posInit > posX1) {
							setTransform(transform, lastTrf);
							return;
						} else {
							allowSwipe = true;
						}
					}
				}
				window.addEventListener('resize', () => {
					if (window.innerWidth > 992) {
						if (slideIndex + 1 === --slides.length) {
							if (posInit > posX1) {
								setTransform(transform, lastTrf);
								return;
							} else {
								allowSwipe = true;
							}
						}
					} else {
						if (slideIndex === --slides.length) {
							if (posInit > posX1) {
								setTransform(transform, lastTrf);
								return;
							} else {
								allowSwipe = true;
							}
						}
					}
				});


				if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
					reachEdge();
					return;
				}

				sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
			}

		},
		swipeEnd = function () {
			posFinal = posInit - posX1;

			isScroll = false;
			isSwipe = false;

			document.removeEventListener('touchmove', swipeAction);
			document.removeEventListener('mousemove', swipeAction);
			document.removeEventListener('touchend', swipeEnd);
			document.removeEventListener('mouseup', swipeEnd);

			sliderList.classList.add('grab');
			sliderList.classList.remove('grabbing');

			if (allowSwipe) {
				swipeEndTime = Date.now();
				if (Math.abs(posFinal) > posThreshold || swipeEndTime - swipeStartTime < 300) {
					if (posInit < posX1) {
						slideIndex--;
					} else if (posInit > posX1) {
						slideIndex++;
					}
				}

				if (posInit !== posX1) {
					allowSwipe = false;
					slide();
				} else {
					allowSwipe = true;
				}

			} else {
				allowSwipe = true;
			}

		},
		setTransform = function (transform, comapreTransform) {
			if (transform >= comapreTransform) {
				if (transform > comapreTransform) {
					sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
				}
			}
			allowSwipe = false;
		},
		reachEdge = function () {
			transition = false;
			swipeEnd();
			allowSwipe = true;
		};



	sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
	sliderList.classList.add('grab');

	sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
	slider.addEventListener('touchstart', swipeStart, { passive: true });
	slider.addEventListener('mousedown', swipeStart);

	arrows.addEventListener('click', function (e) {
		let target = e.target;

		if (target.classList.contains('slideshow-next')) {
			slideIndex++;
		} else if (target.classList.contains('slideshow-prev')) {
			slideIndex--;
		} else {
			return;
		}

		slide();
	});

	var swipeCarousel;

	document.addEventListener('scroll', function a() {
		if (sliderList.getBoundingClientRect().top <= 0) {
			document.removeEventListener('scroll', a);
			swipeCarousel = setInterval(() => {
				if (!document.querySelector('.slideshow-next').classList.contains('disabled')) {
					document.querySelector('.slideshow-next').click();
				} else {
					sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
					slideIndex = 0;
					prev.classList.add('disabled');
					next.classList.remove('disabled');
				}
			}, 3000);
		};
	});



	sliderList.addEventListener('click', () => {
		clearInterval(swipeCarousel);
	})
});
