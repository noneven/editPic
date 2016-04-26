window.onload = function(){
	//naturalWidth vs width
	var container = document.getElementById("container");
	var containerWidth = parseInt(container.style.width);
	var containerHeight = parseInt(container.style.height);
	var mosaic = document.getElementById("mosaic");
	var resetMosaic = document.getElementById("resetMosaic");
	var nextMosaic = document.getElementById("nextMosaic");

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var offcanvas = document.getElementById("offcanvas");
	var offcontext = offcanvas.getContext("2d");

	var img = new Image();
	img.src = "./img/height.jpg";
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

	 	var currentTrack = [];//保存当前绘制路径中的各点
	 	var currentStack = [];
	 	var nextStack = [];
		var mosaicMouseDown = false;
		canvas.onmousedown = function(e){
			mosaicMouseDown = true;
			//鼠标在屏幕的位置
			var cx = e.clientX;
			var cy = e.clientY;
			//canvas相对屏幕的位置
			var rx = (containerWidth-canvas.width)/2;
			var ry = (containerHeight-canvas.height)/2;
			//鼠标相对canvas的距离
			var dx = cx-rx;
			var dy = cy-ry;
			currentTrack.push(drawMosaic([dx,dy]))
			
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

			if (mosaicMouseDown) {
				var lineWeight = parseInt(mosaic.value);
                var len = currentTrack.length;
                //在同一马赛克块则不保存此点
                if((Math.floor(dx/lineWeight) == Math.floor(currentTrack[len-1][0]/lineWeight)) && (Math.floor(dy/lineWeight) == Math.floor(currentTrack[len-1][1]/lineWeight))){
                    return;
                }
        		currentTrack.push(drawMosaic([dx,dy]));
			}
		};
		canvas.onmouseup = function(e){
			mosaicMouseDown = false;
			currentStack.push(currentTrack);
			currentTrack = [];
		};
		canvas.onmouseout = function(e){

			mosaicMouseDown = false;
		};
		canvas.onmouseenter = function(){

			canvas.style.cursor = "url(./img/cursor.ico),pointer";
		}

		function drawMosaic(point){

			var lineWeight = parseInt(mosaic.value);
			var w = canvas.width;
	        var h = canvas.height;

	        //若是新绘制则计算该马赛克块的坐标等信息
	        if( typeof point[2] == 'undefined'){//不是撤销重画
	        	
	        	//赛克块横纵坐标
	            var rectX = Math.floor(point[0]/lineWeight)*lineWeight;
	            var rectY = Math.floor(point[1]/lineWeight)*lineWeight;

	            /*
					var rectX = point[0]-Math.floor(lineWeight/2);
	            	var rectY = point[1]-Math.floor(lineWeight/2);
	            */
	            //取鼠标位置颜色
	            var data = context.getImageData(point[0],point[1],1,1).data;
	            var fillStyle = 'rgba(' + data[0] +','+ data[1] +','+ data[2] +','+ data[3] + ')';
	            point[2] = fillStyle;
	            point[3] = rectX;
	            point[4] = rectY;
	            point[5] = (w > (rectX + lineWeight))?lineWeight:(w-rectX);
	            point[6] = (h > (rectY + lineWeight))?lineWeight:(h-rectY);

	            // currentTrack[currentTrack.length - 1] = point;

	        }
	        //撤销图片时不需再计算;
	        context.fillStyle = point[2];
	        context.fillRect(point[3],point[4],point[5],point[6]);
	        //返回数据保存在历史记录中下次撤销操作不再获取颜色值

	        return point;
		}

		resetMosaic.onclick = function(){
			if (currentStack.length==0) return;
			resetMosaic.style.disabled = false;
			var p = currentStack.pop();
			nextStack.push(p);
			// context.clearRect(0,0,canvas.width,canvas.height);
			context.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);
			for (var i = 0; i < currentStack.length; i++) {
				for (var j = 0; j < currentStack[i].length; j++) {
					drawMosaic(currentStack[i][j])
				}
			}
		}
		nextMosaic.onclick = function(){
			if (nextStack.length==0) return;
			var next = nextStack.pop();
			currentStack.push(next);
			// context.clearRect(0,0,canvas.width,canvas.height);
			// context.drawImage(img, 0, 0, img.width, img.height,0,0,canvas.width,canvas.height);
			for (var j = 0; j < next.length; j++) {
				drawMosaic(next[j]);
			}
		}
	};
};