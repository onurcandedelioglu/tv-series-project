// function init() {

	const swiper = new Swiper('.swiper-container', {
		effect: 'coverflow',
		centeredSlides: true,
		slidesPerView: 1,
		loop: true,
		speed: 600,
		
		//  autoplay: {
		// 	delay: 3000,
		//  },
		
		coverflowEffect: {
			rotate: 50,
			stretch: 0,
			depth: 100,
			modifier: 1,
			
		},
		
		breakpoints: {
			320: {
				slidesPerView: 2,
			},
			560: {
				slidesPerView: 3,
			},
			1248: {
				slidesPerView: 4,
			}
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});


// }

// window.onload = function() {
// 	init();
// };
