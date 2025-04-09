// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    // setup garden
	$loveHeart = $("#loveHeart");
	var offsetX = $loveHeart.width() / 2;
	var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
	gardenCanvas.width = $("#loveHeart").width();
    gardenCanvas.height = $("#loveHeart").height()
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);
	lastPoint = [300+offsetX,0+offsetY+100];
	drawSpeed = 1;
	
	$("#content").css("width", Math.max($loveHeart.width(), $("#code").width()));
	$("#content").css("height", $loveHeart.height()+$("#code").height());
	$("#content").css("margin-top", 10);
	$("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // renderLoop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angle) {
	var t = angle / Math.PI;
	var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
	var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
	return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
	var interval = 50;
	var angle = 10;
	var heart = new Array();
	var animationTimer = setInterval(function () {
		var bloom = getHeartPoint(angle);
		var draw = true;
		for (var i = 0; i < heart.length; i++) {
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) {
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
		}
		if (angle >= 30) {
			clearInterval(animationTimer);
			showMessages();
		} else {
			angle += 0.2;
		}
	}, interval);
}

(function($) {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			$ele.html('');
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				$ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
				if (progress >= str.length) {
					clearInterval(timer);
				}
			}, 75);
		});
		return this;
	};
})(jQuery);

function timeElapse(date){
	var current = Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds"; 
	$("#elapseClock").html(result);
}

function showMessages() {
	adjustWordsPosition();
	$('#messages').fadeIn(5000, function() {
		showLoveU();
	});
}

function adjustWordsPosition() {
	$('#words').css("position", "absolute");
	$('#words').css("top", $("#garden").position().top + 195);
	$('#words').css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
	$('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
	$('#loveu').fadeIn(3000);
}

function getHeadPoint(angle) {
	var l1 = 1.1;
	var l2 = 1.25;
	var l3 = 1.35;
	var l4 = 1.70;
	var l5 = 1.82;
	var l6 = 1.94;
	if(angle < l1*Math.PI || (angle > l3*Math.PI && angle < l4*Math.PI) || angle > l6*Math.PI) {
		drawSpeed = 0.8;
		lastPoint = getEllipsePoint(lastPoint[0], lastPoint[1]);
		return lastPoint;
	}
	else if(angle < l2*Math.PI) {//  /
		drawSpeed = 0.2
		lastPoint = getLinePoint(lastPoint[0], lastPoint[1], 1.5*Math.PI);
		return lastPoint;
	}
	else if(angle <= l3*Math.PI) {//  /\
		drawSpeed = 0.2
		lastPoint = getLinePoint(lastPoint[0], lastPoint[1], 0.25*Math.PI);
		return lastPoint;
	}
	else if(angle >= l4*Math.PI && angle < l5*Math.PI) {
		drawSpeed = 0.2
		lastPoint = getLinePoint(lastPoint[0], lastPoint[1], 1.75*Math.PI);
		return lastPoint;
	}
	else if(angle >= l5*Math.PI && angle <= l6*Math.PI) {
		drawSpeed = 0.2
		lastPoint = getLinePoint(lastPoint[0], lastPoint[1], 0.5*Math.PI);
		return lastPoint;
	}
	// var t = angle / Math.PI;
	// var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
	// var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
	// return new Array(offsetX + x, offsetY + y);
}

function getEllipsePoint(startx, starty) {
    var a = 300; // 长轴半径
    var b = 200; // 短轴半径
	var t = Math.atan2((starty - offsetY - 100)*a , (startx - offsetX)*b); // 计算当前点的角度
    var x = a * Math.cos(t+0.08);
    var y = b * Math.sin(t+0.08);
	lastPoint = [x+offsetX, y+offsetY+100]; // 计算椭圆上的点
    return lastPoint; // 加上偏移量，使椭圆居中
}

function getLinePoint(startx, starty, theta) {
    return [startx+Math.cos(theta)*10, starty+Math.sin(theta)*10]; // 加上偏移量，使椭圆居中
}

function startHeadAnimation() {
	var interval = 50;
	var angle = 0;
	var heart = new Array();
	var animationTimer = setInterval(function () {
		var bloom = getHeadPoint(angle);
		var draw = true;
		for (var i = 0; i < heart.length; i++) {
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) {
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
		}
		if (angle >= 2.2*Math.PI) {
			clearInterval(animationTimer);
			showMessages();
		} else {
			angle += 0.1*drawSpeed;
		}
	}, interval);
}