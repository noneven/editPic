window.onload = function(){
	//naturalWidth width
	var container = document.getElementById("container");
	var containerWidth = parseInt(container.style.width);
	var containerHeight = parseInt(container.style.height);

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	var point = document.getElementById("point");

	console.log(canvas.getBoundingClientRect());

	var img = new Image();
	img.src = "./img/canvas1.jpg";
	img.onload = function(){

		var wR = img.width/containerWidth;
		var hR = img.height/containerHeight;

		if (hR>wR) {
			canvas.width = containerWidth/hR;
			canvas.height = containerHeight;
		}else{
			canvas.width = containerWidth;
			canvas.height = containerHeight/wR;
		}
		canvas.style.border = "1px solid #258";
		context.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);

		var scale = point.value;
		var isPointMouseDown = false;
		point.onmousedown = function(e){
			isPointMouseDown = true;
		};
		point.onmouseup = function(e){
			isPointMouseDown = false;
		};
		point.onmouseout = function(e){
			isPointMouseDown = false;
		};
		point.onmousemove = function(e){

			if (!isPointMouseDown) return;
			context.clearRect(0,0,canvas.width,canvas.height);

			scale = point.value;

			var sx = (canvas.width-canvas.width*scale)/2;
			var sy = (canvas.height-canvas.height*scale)/2;

			context.drawImage(img,sx,sy,canvas.width*scale,canvas.height*scale);
		}
	};
};