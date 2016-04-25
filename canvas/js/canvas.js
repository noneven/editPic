window.onload = function(){
	//naturalWidth vs width
	var container = document.getElementById("container");
	var containerWidth = parseInt(container.style.width);
	var containerHeight = parseInt(container.style.height);

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	var point = document.getElementById("point");

	console.log(canvas.getBoundingClientRect());

	var img = new Image();
	img.src = "./img/height.jpg";
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

		var movescale,movesx,movesy;

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
			if (typeof movesx!="undefined"&&scale>1) {
				console.log(movesx+"-"+movesy)
				var wr = movesx/(canvas.width-canvas.width*movescale);
				var hr = movesy/(canvas.height-canvas.height*movescale);
				console.log("wr-"+wr);
				console.log("hr-"+hr);
				sx = (canvas.width-canvas.width*scale)*wr;
				sy = (canvas.height-canvas.height*scale)*hr;
			}
			context.drawImage(img,sx,sy,canvas.width*scale,canvas.height*scale);
		}
		point.onchange = function(){

			if (scale>1) initDrag()
		}

		function initDrag(){
			var sx = (canvas.width-canvas.width*scale)/2;
			var sy = (canvas.height-canvas.height*scale)/2;	
			var ismousedown = false;
			var downpoint = {};
			var x,y;
			canvas.onmousedown = function(e){
				this.style.cursor = "pointer";
				ismousedown = true;
				downpoint.x = e.clientX;
				downpoint.y = e.clientY;
			};

			canvas.onmousemove = function(e){
				if (!ismousedown) return;
				var w = e.clientX-downpoint.x;
				var h = e.clientY-downpoint.y;

				var _sx = (canvas.width-canvas.width*scale)/2;
				var _sy = (canvas.height-canvas.height*scale)/2;

				x = ((sx + w)<0)?(sx + w):0;
				y = ((sy + h)<0)?(sy + h):0;

				if (x<2*_sx) x = 2*_sx;
				if (y<2*_sy) y = 2*_sy;

				context.clearRect(0,0,canvas.width,canvas.height);
				context.drawImage(img,x,y,canvas.width*scale,canvas.height*scale);
			};

			canvas.onmouseup = function(e){
				this.style.cursor = "default";
				if (ismousedown) {
					sx = x;
					sy = y;
					ismousedown = false;
					movesx = sx;
					movesy = sy;
					movescale = scale;
				}
				
			};

			canvas.onmouseout = function(e){
				if (ismousedown) {
					sx = x;
					sy = y;
					ismousedown = false;
					movesx = sx;
					movesy = sy;
					movescale = scale;	
				}
			}
		}
	};
};