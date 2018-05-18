function Maps(obj) {
	this.dom = document.getElementById(obj.id);
	this.cellWidth = obj.width;
	this.cellHeight = obj.height;
	this.cellBgColor = obj.bgColor;
	this.arr = [];
}
Maps.prototype = {
	init: function(){
		console.log('生成地图');
		this.render();
		console.log(this.arr);
	},
	// 渲染地图
	render: function(){
		var canvas = this.dom;
		var ctx = canvas.getContext("2d");
		var width = this.cellWidth;
		var height = this.cellHeight;
		var line = canvas.clientWidth / width;

		
		this.initArray(line, line);
		console.log(this.arr);
		this.renderCell(line, ctx, width, height);
		
	},
	// 渲染格子
	renderCell: function(line, ctx, width, height){
		for (var i = 0; i < line; i++) {
			for(var j = 0; j < line; j++) {
				ctx.beginPath();
				ctx.fillStyle = this.cellBgColor;
				ctx.strokeStyle = '#afafaf';
				ctx.strokeRect(i * width, j * height, width, height );
				ctx.fillRect(i * width, j * height, width, height);
				ctx.closePath();
			}
		}
		
	},
	// 生成随机数，这个随机数是一个二维数组
	initArray: function(horizontal, vertical){
	    for(var i = 0; i < 2 * horizontal + 1; ++i) {
	        this.arr[i] = [];
	        for(var n = 0; n < 2 * vertical + 1; ++n) {
	            if((n ^ (n - 1)) === 1 && (i ^ (i - 1)) === 1) {
	                this.arr[i][n] = 0;               // 0 表示路
	                this.notAccessed.push(0);
	            }else {
	                this.arr[i][n] = 1;                   // 1 表示墙
	            }
	        }
	    }
	}
}