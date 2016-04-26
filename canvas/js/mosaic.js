window.onload = function(){
	//naturalWidth vs width
	var container = document.getElementById("container");
	var containerWidth = parseInt(container.style.width);
	var containerHeight = parseInt(container.style.height);

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var offcanvas = document.getElementById("offcanvas");
	var offcontext = offcanvas.getContext("2d");

	var img = new Image();
	img.src = "./img/width.jpg";
	img.crossOrigin = '';
	img.onload = function(){

		var imgR = img.height/img.width;
		var containerR = containerHeight/containerWidth;
		if (imgR>containerR) {
			canvas.height = containerHeight;
			canvas.width = canvas.height/imgR;
			
		}else{
			canvas.width = containerWidth;
			canvas.height = canvas.width*imgR;
		}
		var icWR = img.width/canvas.width;
		var icHR = img.height/canvas.height;

		offcanvas.width = canvas.width;
		offcanvas.height = canvas.height;

		canvas.style.border = "1px solid red";
		//把图片按比例绘制在canvas里面
		context.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);
		//把图片绘制在离屏canvas里面，这个离屏canvas的大小比例和canvas的大小比例相同，只是大小不一样，
		//离屏canvas是载入的原图，而可视canvas是载入的原图缩放版
		offcontext.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);



		var mosaicMouseDown = false;
		canvas.onmousedown = function(e){
			mosaicMouseDown = true;
		};
		canvas.onmousemove = function(e){
			//鼠标在屏幕的位置
			var cx = e.clientX;
			var cy = e.clientY;
			//canvas相对屏幕的位置
			var rx = (containerWidth-canvas.width)/2;
			var ry = (containerHeight-canvas.height)/2;
			//鼠标相对canvas的距离
			var dx = cx-rx;
			var dy = cy-ry;

			var data = context.getImageData(dx,dy,1,1).data;
			console.log(data)

			var mr = 10;
			if (mosaicMouseDown) {
				//清除画布重新载入图片
				// context.clearRect(0,0,canvas.width,canvas.height);
				context.save();

				//画一个矩形
				context.beginPath();
				context.lineWidth = 1;
				context.strokeStyle = "#fff";

				context.restore();
			}
		};
		canvas.onmouseup = function(e){
			mosaicMouseDown = false;
		};
		canvas.onmouseout = function(e){
			mosaicMouseDown = false;
		};
	};
};