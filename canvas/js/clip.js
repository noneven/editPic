window.onload = function(){
	document.getElementById("mohuimg").style.display = "block"
	//naturalWidth vs width
	var container = document.getElementById("container");
	var clipwrap = document.getElementById("clipwrap");
	var clip = document.getElementById("clip");
	var containerWidth = parseInt(container.style.width);
	var containerHeight = parseInt(container.style.height);

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var offcanvas = document.getElementById("offcanvas");
	var offcontext = offcanvas.getContext("2d");

	var img = new Image();
	img.src = "./img/width.jpg";
	img.onload = function(){
		//按照图片的长宽比例载入到固定长宽的矩形框中
		// var wR = img.width/containerWidth;
		// var hR = img.height/containerHeight;
		// if (hR>wR) {
		// 	canvas.width = containerWidth/hR;
		// 	canvas.height = containerHeight;
		// }else{
		// 	canvas.width = containerWidth;
		// 	canvas.height = containerHeight/wR;
		// }
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
		// context.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);
		//把图片绘制在离屏canvas里面，这个离屏canvas的大小比例和canvas的大小比例相同，只是大小不一样，
		//离屏canvas是载入的原图，而可视canvas是载入的原图缩放版
		offcontext.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);

		var firstClipMouseDown = false;
		var _dx ,_dy,w,h,_cx,_cy;
		canvas.onmousedown = function(e){
			firstClipMouseDown = true;
			//鼠标在屏幕的位置
			var cx = e.clientX;
			var cy = e.clientY;
			//canvas相对屏幕的位置
			var rx = (containerWidth-canvas.width)/2;
			var ry = (containerHeight-canvas.height)/2;
			//鼠标相对canvas的距离
			_dx = cx-rx;
			_dy = cy-ry;
			_cx = cx;
			_cy = cy;
			
			clipwrap.style.display = "none";
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

			var mr = 100;
			//算出鼠标点击位置在原图像的位置
			var lx = icWR*dx-mr
			var ly = icHR*dy-mr

			// var w,h;
			if (firstClipMouseDown) {
				//清除画布重新载入图片
				context.clearRect(0,0,canvas.width,canvas.height);
				//context.drawImage(img, 0,0,canvas.width,canvas.height);
				// clipwrap.style.left = _dx+rx+"px";
				// clipwrap.style.top = _dy+ry+"px";
				// clipwrap.style.width = (dx-_dx)+"px";
				// clipwrap.style.height = (dy-_dy)+"px";

				context.save();

				//画一个矩形
				context.beginPath();
				context.lineWidth = 1;
				context.strokeStyle = "#fff";
				context.strokeRect(_dx,_dy,dx-_dx,dy-_dy);

				// context.clip();

				// context.save();
				// context.beginPath();
				// context.lineWidth = 2;
				// context.strokeStyle = "red";

				// context.arc(dx,dy,100,0,2*Math.PI);
				// context.stroke()
				// context.clip();

				//把离屏的canvas画在canvas上的鼠键点击位置
				context.drawImage(offcanvas,_dx,_dy,dx-_dx,dy-_dy,_dx,_dy,dx-_dx,dy-_dy)
				w = dx-_dx;
				h = dy-_dy
				context.restore();
				mx = _dx;
				my = _dy;
			}
		};
		canvas.onmouseup = function(e){
			firstClipMouseDown = false;

			//鼠标在屏幕的位置
			var cx = e.clientX;
			var cy = e.clientY;
			//canvas相对屏幕的位置
			var rx = (containerWidth-canvas.width)/2;
			var ry = (containerHeight-canvas.height)/2;
			//鼠标相对canvas的距离
			var dx = cx-rx;
			var dy = cy-ry;

			if (dx-_dx>10&&dy-_dy>10) {
				clipwrap.style.left = _cx+"px";
				clipwrap.style.top = _cy+"px";
				clipwrap.style.width = w+"px";
				clipwrap.style.height = h+"px";
				clipwrap.style.display = "block";

				// _cx = cx;
				// _cy = cy;
			}


		};
		canvas.onmouseout = function(e){
			firstClipMouseDown = false;
			//移除时重新绘制原图(恢复放大前)
			// context.clearRect(0,0,canvas.width,canvas.height);
			// context.drawImage(img, 0,0,canvas.width,canvas.height);
		};

		var isClipMouseDown = false;
		var __ex,__ey, mx,my;
		clipwrap.onmousedown = function(e){
			isClipMouseDown = true;
			clipwrap.style.cursor = "move";
			//鼠标点击拖动的位置
			__ex = e.clientX;
			__ey = e.clientY;
		};
		clipwrap.onmousemove = function(e){
			//鼠标在屏幕的位置
			var cx = e.clientX;
			var cy = e.clientY;
			//canvas相对屏幕的位置
			var rx = (containerWidth-canvas.width)/2;
			var ry = (containerHeight-canvas.height)/2;
			//鼠标相对canvas的距离
			var dx = cx-rx;
			var dy = cy-ry;

			if (isClipMouseDown) {
				context.clearRect(0,0,canvas.width,canvas.height);
				clipwrap.style.left = _cx+(cx-__ex)+"px";
				clipwrap.style.top = _cy+(cy-__ey)+"px";
				mx = _dx+(cx-__ex);
				my = _dy+(cy-__ey);
				
				if (my<0) {
					clipwrap.style.top = ry+"px";
				} if (mx<0) {
					clipwrap.style.left = rx+"px";
				}

				mx = (mx>0)?mx:0;
				my = (my>0)?my:0;

				if(mx+w>canvas.width){
					clipwrap.style.left = (canvas.width-w+rx)+"px";
					mx = canvas.width-w;
				} if(my+h>canvas.height){
					clipwrap.style.top = (canvas.height-h+ry)+"px";
					my = canvas.height-h;
				}

				context.drawImage(offcanvas,mx,my,w,h, mx,my,w,h)

			}
		};
		clipwrap.onmouseup = function(e){
			isClipMouseDown = false;
			clipwrap.style.cursor = "default";
		}
		clipwrap.onmouseout = function(e){
			isClipMouseDown = false;
			clipwrap.style.cursor = "default";
		}

		clip.onclick = function(){
			var imgR = h/w;
			console.log(imgR)

			var containerR = containerHeight/containerWidth;
			console.log(containerR)
			if (imgR>containerR) {
				canvas.height = containerHeight;
				canvas.width = canvas.height/imgR;
				
			}else{
				canvas.width = containerWidth;
				canvas.height = canvas.width*imgR;
			}
			context.clearRect(0,0,canvas.width,canvas.height);
			document.getElementById("mohuimg").style.display = "none";
			clipwrap.style.display = "none";

			// context.drawImage(img,mx,my,w,h, mx,my,w,h);
			context.drawImage(offcanvas, mx, my, w,h,0,0,canvas.width,canvas.height)
		}
	};
};