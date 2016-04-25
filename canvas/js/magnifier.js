window.onload = function(){
	//naturalWidth vs width
	var container = document.getElementById("container");
	var containerWidth = parseInt(container.style.width);
	var containerHeight = parseInt(container.style.height);

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var offcanvas = document.getElementById("offcanvas");
	var offcontext = offcanvas.getContext("2d");


	var magnifierInput = document.getElementById("magnifier");
	var magnifierType = document.getElementsByName("magnifierType");
	function getRadioValue(magnifierType){
		var magnifierTypeValue;//默认圆形1 正方形0；
		for (var i = 0; i < magnifierType.length; i++) {
			if(magnifierType[i].checked){
				magnifierTypeValue = magnifierType[i].value;
				break;
			}
		}
		return magnifierTypeValue
	}
	var magnifierTypeValue = 1;
	var typeMap = {
		0:"rect",
		1:"arc"
	};

	var img = new Image();
	img.src = "./img/height.jpg";
	img.onload = function(){
		//按照图片的长宽比例载入到固定长宽的矩形框中
		var wR = img.width/containerWidth;
		var hR = img.height/containerHeight;
		if (hR>wR) {
			canvas.width = containerWidth/hR;
			canvas.height = containerHeight;
		}else{
			canvas.width = containerWidth;
			canvas.height = containerHeight/wR;
		}
		var icWR = img.width/canvas.width;
		var icHR = img.height/canvas.height;

		offcanvas.width = img.width;
		offcanvas.height = img.height;

		canvas.style.border = "1px solid #258";
		//把图片按比例绘制在canvas里面
		context.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);
		//把图片绘制在离屏canvas里面，这个离屏canvas的大小比例和canvas的大小比例相同，只是大小不一样，
		//离屏canvas是载入的原图，而可视canvas是载入的原图缩放版
		offcontext.drawImage(img,0,0);

		var magnifierMouseDown = false;
		canvas.onmousedown = function(e){
			magnifierMouseDown = true;
			//获取放大镜形状的值
		 	magnifierTypeValue = getRadioValue(magnifierType)
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
			//放大区域半径，正方向时代表边长的一般
			var mr = magnifierInput.value;
			var type = typeMap[magnifierTypeValue];

			//算出鼠标点击位置在原图像的位置
			var lx = icWR*dx-mr
			var ly = icHR*dy-mr

			if (magnifierMouseDown) {
				//清除画布重新载入图片
				context.clearRect(0,0,canvas.width,canvas.height);
				context.drawImage(img, 0,0,canvas.width,canvas.height);

				context.save();
				context.beginPath();
				context.lineWidth = 2;
				context.strokeStyle = "red";

				if (type == "arc") {//圆形绘制
					context.arc(dx,dy,mr,0,2*Math.PI);
					context.stroke()
					context.clip();
				}else if (type == "rect") {//矩形绘制
					context.strokeRect(dx-mr,dy-mr,2*mr,2*mr);
				}

				//把离屏的canvas画在canvas上的鼠键点击位置
				context.drawImage(offcanvas,lx,ly,2*mr,2*mr,dx-mr,dy-mr,2*mr,2*mr)
				context.restore()
			}
		};
		canvas.onmouseup = function(e){
			magnifierMouseDown = false;
		};
		canvas.onmouseout = function(e){
			magnifierMouseDown = false;
			//移除时重新绘制原图(恢复放大前)
			context.clearRect(0,0,canvas.width,canvas.height);
			context.drawImage(img, 0,0,canvas.width,canvas.height);
		};

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
		point.onchange = function(){

			//if (scale>1) initDrag()
		}
	};
};