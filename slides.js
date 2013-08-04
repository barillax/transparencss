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
		}).transition({
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
	var $slideClean = null;
	var $slideFuzzy = null;
	var $dragging = null;
	var dragY = 0;
	var projectorTop = 0;
	$("#grabber").on("mousedown", function(e) {
		$dragging = $(this);
		$dragging.attr('unselectable', 'on');
		$slideClean = $(".clean");
		$slideFuzzy = $(".fuzzy");

		dragY = e.pageY;
		projectorTop = +$projector.css("top").slice(0,-2);
		pauseEvent(e);

		$(document.body).on("mousemove", function(e) {
			if ($dragging == null) return;
			var diff = e.pageY - dragY;
			diff = diff + projectorTop;

			diff = Math.max(-50, Math.min(50, diff));

			// Drag projector
			$projector.css({top : diff + "px"});

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

			pauseEvent(e);
		}).on("mouseup", function(e) {
			$dragging.attr('unselectable', 'off');
			$dragging = null;
			$(this).off("mousemove");
			$(this).off("mouseup");
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