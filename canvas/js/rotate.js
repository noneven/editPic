window.onload = function(){
	//naturalWidth vs width
	var container = document.getElementById("container");
	var containerWidth = parseInt(container.style.width);
	var containerHeight = parseInt(container.style.height);
	var reset = document.getElementById("reset");
	var rotate = document.getElementById("rotate");

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var offcanvas = document.getElementById("offcanvas");
	var offcontext = offcanvas.getContext("2d");

	var img = new Image();
	img.src = "./img/height.jpg";
	img.onload = function(){
		console.log(img.width+"-"+img.height);

		var imgR = img.height/img.width;

		var containerR = containerHeight/containerWidth;

		if (imgR>containerR) {
			canvas.height = containerHeight;
			canvas.width = canvas.height/imgR;
		}else{
			canvas.width = containerWidth;
			canvas.height = canvas.width/imgR
		}

		canvas.style.border = "1px solid #258";
		context.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);

		offcanvas.width = canvas.width;
		offcanvas.height = canvas.height;
		offcontext.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);
		//旋转度数
		var degrees = 0;
		function doRotate(degrees){
			reset.disabled = false;
			context.save();
			degrees = degrees%360
			var wh = getCanvasWHByDeg(degrees);
			canvas.width = wh.w;
			canvas.height = wh.h;
			switch(degrees){
				case 90:
				context.translate(canvas.width, 0);
				break;
				case 180:
				context.translate(canvas.width, canvas.height);
				break;
				case 270:
				context.translate(0, canvas.height);
				break;
				case 0:
				break;
				default:
				//not do
			}
			//旋转
			context.rotate(degrees*Math.PI/180);
			//清空画布
			context.clearRect(0,0,canvas.width,canvas.height);
			//重画
			(degrees%180==90)?
				context.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.height,canvas.width):
				context.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);
			context.restore();
		}

		function getCanvasWHByDeg(deg){
			if (deg%180==90) {
				var imgR = img.width/img.height;
				return (imgR>containerR)? {
					h: containerHeight,
					w: containerHeight/imgR,
				}: {
					w: containerWidth,
					h: containerWidth/imgR,
				}
			}else if (deg%180==0) {
				var canvasR = canvas.width/canvas.height;
				return (canvasR>containerR)? {
					h: containerHeight,
					w: containerHeight/canvasR,
				}: {
					w: containerWidth,
					h: containerWidth/canvasR,
				}
			}
		}
		rotate.onclick = function(){
			degrees = (degrees+90);
			doRotate(degrees);
		}
		reset.onclick = function(){
			if(degrees>0){
				degrees -= 90;
				doRotate(degrees);
				(degrees==0)&&(reset.disabled = true);
			}else reset.disabled = true;
		}
	};
};