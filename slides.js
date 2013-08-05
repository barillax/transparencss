$(document).ready(function() {
	var slideArray = [];
	$($.parseHTML($("#slides").text())).children().each(function(i) {
		slideArray.push($(this));
	})

	var $slideContentContainer = $(".slide-content-container");
	var currentSlide = 0;
	function insertSlide(num) {
		$slideContentContainer.transition({
			y: 700, x: -70, rotate: '18deg'
		}).queue(function(next) {
			$slideContentContainer.empty().append(
				slideArray[num].clone().addClass("fuzzy").addClass("slide-content")
			).append(
				slideArray[num].clone().addClass("clean").addClass("slide-content")
			);
			next();
		}).delay(100)
		.transition({
			delay: 250, y: 0, x: 0, rotate: Math.random()*6-3 + "deg"
		});
		$(".slide-number").text(currentSlide+1 + " of " + slideArray.length)
	}

	insertSlide(currentSlide);

	$(".btn-left").click(function(el) {
		if (currentSlide > 0) {
			insertSlide(--currentSlide);
		}
	});

	$(".btn-right").click(function(el){
		if (currentSlide < slideArray.length-1) {
			insertSlide(++currentSlide);
		}
	});

	var $container = $("#container");
	var $projector = $("#projector");

	$("#grabber").on("vmousedown", function(e) {
		var $dragging = $(this);
		var $slideClean = $(".clean");
		var $slideFuzzy = $(".fuzzy");
		var dragY = e.pageY;
		var projectorTop = +$projector.css("top").slice(0,-2);
		pauseEvent(e);

		$dragging.attr('unselectable', 'on');

		var updateBlur = function(diff) {
			// Compute offset for blur and perspective
			diff = diff/50.0;
			var distDiff = (diff + 1)/2.0;
			var scale = distDiff * 0.4 + 0.8;
			diff = Math.abs(diff);

			$slideClean.css({"-webkit-filter": "blur(" + diff*3 + "px)"});
			$slideClean.css({"filter": "blur(" + diff*3 + "px)"});

			// Only update fuzzy CSS for webkit, since other browsers don't support masking
			$slideFuzzy.css({"-webkit-filter": "blur(" + (diff + 1.5) + "px)"});

			$container.css({"-webkit-transform": "perspective(90px) rotateX(-1deg) scale(" +scale + "," + scale + ")"});
			$container.css({"transform": "perspective(90px) rotateX(-1deg) scale(" +scale + "," + scale + ")"});
		}

		// Throttle for mobile devices
		if(navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
			updateBlur = _.throttle(updateBlur, 500, {leading: false});
		}

		$(document.body).on("vmousemove", function(e) {
			if ($dragging == null) return;
			var diff = e.pageY - dragY;
			diff = diff + projectorTop;

			diff = Math.max(-50, Math.min(50, diff));

			// Drag projector
			$projector.css({top : diff + "px"});

			updateBlur(diff);

			pauseEvent(e);
		}).on("vmouseup", function(e) {
			$dragging.attr('unselectable', 'off');
			$dragging = null;
			$(this).off("vmousemove vmouseup");
		});
	});

	function pauseEvent(e){
		e = e || window.event;
	    if(e.stopPropagation) e.stopPropagation();
	    if(e.preventDefault) e.preventDefault();
	    e.cancelBubble=true;
	    e.returnValue=false;
	    return false;
	}
});