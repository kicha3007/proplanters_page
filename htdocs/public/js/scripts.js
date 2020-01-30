;
"use strict";

function DOMready() {

	var $rangeCreditBox = $("[data-credit-form-box-range-slider]");
	var $inputCreditBox = $("[data-range-slider-input]");
	var instanceCreditBox;
	var min = 5000;
	var max = 1000000;

	$rangeCreditBox.ionRangeSlider({
		// skin: "round",
		type: "single",
		min: min,
		max: max,
		grid: true,
		grid_num: 3,
		hide_from_to: true,
		hide_min_max: true,

		from: 120000,
		onStart: function(data) {
			$inputCreditBox.prop("value", data.from);
			$(".range-slider-box .js-grid-text-1").text("100 000");
			$(".range-slider-box .js-grid-text-2").text("300 000");
		},
		onChange: function(data) {
			$inputCreditBox.prop("value", data.from);
		}
	});

	instanceCreditBox = $rangeCreditBox.data("ionRangeSlider");

	$inputCreditBox.on("input", function() {
		var val = $(this).prop("value");

		// validate
		if (val < min) {
			val = min;
		} else if (val > max) {
			val = max;
		}

		instanceCreditBox.update({
			from: val
		});
	});

	function slowScroll(id) {
		var offset = 0;
		$('html, body').animate({
			scrollTop: $(id).offset().top - offset
		}, 1000);
		return false;
	}

	$("[data-credit-offer-box-link]").on("click", function (e) {

		e.preventDefault();
		slowScroll("#credit-form-box");

	});

	$("[data-credit-card-box-wrap]").owlCarousel({
		loop:true,
		margin:40,
		items:2,
		nav:true,
		dots: false,
		responsive:{
			0:{
				items:1
			},
			575:{
				items:2,
				margin:20,
			},
			767:{
				items:3
			}
		}
	})


}

document.addEventListener("DOMContentLoaded", DOMready);