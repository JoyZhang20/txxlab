var divWork;
var workW = 800,
    workH = 800;
var posX = 600,
    posY = 100;
var pointsArray = new Array(); //存储点

var fillColor = "#ff0000"; //填充颜色，待解决：十进制转换十六进制中的位数丢失问题

function main() {
    initWorkArea(workW, workH, posX, posY, "#000000");
}

//直线段扫描填充
function useScanPolyFill() {
	var ymin, ymax;
	var rct = calcRect(pointsArray);
	var lines = [];
	ymin = rct[1];
	ymax = rct[3];

	var cnt = pointsArray.length;
	for (var i = 0; i < cnt - 1; i++) {
		lines.push([{
			x: pointsArray[i].x,
			y: pointsArray[i].y
		}, {
			x: pointsArray[i + 1].x,
			y: pointsArray[i + 1].y
		}]);
	}
	lines.push([{
		x: pointsArray[cnt - 1].x,
		y: pointsArray[cnt - 1].y
	}, {
		x: pointsArray[0].x,
		y: pointsArray[0].y
	}]);

	var xroot = [],
		xr;
	lncnt = lines.length;
	for (var y = ymin; y < ymax; y++) {
		for (var i = 0; i < lncnt; i++) {
			if (judgeCross(lines[i], y)) {
				xr = getXRoot(lines[i], y);
				xroot.push(Math.round(xr));
			}
		}
		xroot.sort(function(a, b) {
			return a - b
		}); //数值数组通过比值函数升序排列，改为 return b-a则为降序
		if (xroot.length >= 3 && xroot.length % 2 == 1) {
			xroot = distinct(xroot);
		}
		var segcnt = int(xroot.length / 2);
		for (var i = 0; i < segcnt; i++) {
			BresenhamLine(xroot[i * segcnt], y, xroot[i * segcnt + 1], y, fillColor);
		}
		xroot.length = 0;
	}
}
//数组去重
function distinct(arr) {
	return Array.from(new Set(arr))
}
function getXRoot(ln, y) {
	x0 = ln[0].x, y0 = ln[0].y;
	x1 = ln[1].x, y1 = ln[1].y;
	if (x1 == x0) {
		return x0;
	}
	k = (y1 - y0) / (x1 - x0);
	b = y0 - k * x0;
	x = (y - b) / k;
	return x;
}
function judgeCross(myln, lny) {
	p0y = myln[0].y;
	p1y = myln[1].y;
	if ((p0y - lny) * (p1y - lny) <= 0) {
		return true;
	}
	return false;
}
function calcRect(poly) {
	cnt = poly.length;
	xmin = 10000, xmax = -10000, ymin = 10000, ymax = -10000;
	for (i = 0; i < cnt; i++) {
		x = poly[i].x;
		y = poly[i].y;
		if (x < xmin) {
			xmin = x;
		}
		if (y < ymin) {
			ymin = y;
		}
		if (x >= xmax) {
			xmax = x;
		}
		if (y >= ymax) {
			ymax = y;
		}
	}
	return [xmin, ymin, xmax, ymax];
}












//三维设计实验
function useThree() {
    window.location.href = 'three.html';
}
//图像灰度哈和图像融合
function useDrawImage() {
    document.querySelector("#tip").innerHTML = "页面放在一个远程的服务器上，但是不排除网络问题导致无法访问"
    window.location.href = 'https://joyzhang20.github.io/txxlab/drawimage.html';
}

//RGB三原色：利用圆的方程画出一个正方形的内切圆，根据每个点的所属范围进行不同的涂色
function showRGB() {
    for (var i = 200; i <= 400; i++) {
        for (var j = 200; j <= 400; j++) {
            if (isInCircle(100, 300, 300, i, j))
                setPixel(i, j, "#00ff00");
        }
    }
    for (var i = 300; i <= 500; i++) {
        for (var j = 200; j <= 400; j++) {
            if (isInCircle(100, 400, 300, i, j) && isInCircle(100, 300, 300, i, j)) {
                setPixel(i, j, "#00ffff");
            } else if (isInCircle(100, 400, 300, i, j)) {
                setPixel(i, j, "#0000ff");
            }
        }
    }
    for (var i = 250; i <= 450; i++) {
        for (var j = 300; j <= 500; j++) {
            if (isInCircle(100, 350, 400, i, j) && isInCircle(100, 400, 300, i, j) && isInCircle(100, 300, 300, i, j)) {
                setPixel(i, j, "#ffffff");
            } else if (isInCircle(100, 350, 400, i, j) && isInCircle(100, 400, 300, i, j)) {
                setPixel(i, j, "#ff00ff");
            } else if (isInCircle(100, 350, 400, i, j) && isInCircle(100, 300, 300, i, j)) {
                setPixel(i, j, "#ffff00");
            } else if (isInCircle(100, 350, 400, i, j)) {
                setPixel(i, j, "#ff0000");
            }
        }
    }
}
//利用圆的方程来判断点(x,y)是否在原点为(x0,y0)半径为r的圆内
function isInCircle(r, x0, y0, x, y) {
    return (x - x0) * (x - x0) + (y - y0) * (y - y0) <= r * r ? 1 : 0
}

//调用二阶贝塞尔算法，画出对应曲线
function useDoubleBezier() {
    for (var j = 0.01; j < 1; j += 0.01) {
        setPixel(doubleBezier(j, pointsArray[0], pointsArray[1], pointsArray[2]).x, doubleBezier(j, pointsArray[0],
            pointsArray[1], pointsArray[2]).y, fillColor, 2);
    }
}

//二阶贝塞尔绘制
function doubleBezier(t, p0, p1, p2) {
    var x = ((1 - t) * (1 - t)) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
    var y = ((1 - t) * (1 - t)) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;
    return {
        x: x,
        y: y
    }
}

//弧长累进算法：判断点与多边形关系，最后一个点作为待判断的点，顺时针或逆时针皆可
function usePointPosition() {
    var originX = pointsArray[pointsArray.length - 1].x; //以最后一个点作为原点，建立坐标系，判断其余点的象限
    var originY = pointsArray[pointsArray.length - 1].y;
    var arcLength = 0; //弧长
    var pointsQuadrant = new Array(); //存储点的象限信息
    for (var i = 0; i < pointsArray.length - 1; i++) { //遍历点获取每个点的象限
        pointsQuadrant[i] = getQuadrant(originX, originY, pointsArray[i].x, pointsArray[i].y)
    }
    for (var i = 0; i < pointsArray.length - 1; i++) { //遍历每两个点，计算两者间象限的差值
        var quadrantDiff = (pointsQuadrant[(i + 1) % (pointsArray.length - 1)] - pointsQuadrant[i] + 4) % 4; //保证循环的安全及象限差值的合法性
        if (quadrantDiff == 0) { //对象限差值的不同情况进行累计弧长
            arcLength += 0;
        } else if (quadrantDiff == 1) {
            arcLength += Math.PI / 2;
        } else if (quadrantDiff == 3) {
            arcLength -= (Math.PI / 2);
        } else if (quadrantDiff == 2) { //差值为2时需要进行进一步的判断
            var f = ((pointsArray[(i + 1) % (pointsArray.length - 1)].y - originY) * (pointsArray[i].x - originX)) - //注意是相对于原点的x、y作运算
                ((pointsArray[(i + 1) % (pointsArray.length - 1)].x - originX) * (pointsArray[i].y - originY));
            if (f > 0) {
                arcLength += Math.PI;
            } else if (f < 0) {
                arcLength -= Math.PI;
            }
        }
    }
    var result = ""
    arcLength = Math.abs(arcLength) //取绝对值以实现不同方向的判断
    if (arcLength == 0) {
        result = "被检测点不在多边形内";
    } else if (arcLength == Math.PI) {
        result = "被检测点在多边形的边界";
    } else if (arcLength == 2 * Math.PI) {
        result = "被检测点在多边形内";
    }
    document.querySelector("#tip").innerHTML = result;
}
//计算象限：origin即原点坐标，这里并没有保存多边形每个点相对于待检测点的位置，而只是判断了其相对的象限位置
function getQuadrant(originX, originY, pointX, pointY) {
    var pointQuadrant = 0;
    if ((pointX - originX) > 0) {
        if ((pointY - originY) > 0) {
            pointQuadrant = 1;
        } else {
            pointQuadrant = 4;
        }
    } else {
        if ((pointY - originY) > 0) {
            pointQuadrant = 2;
        } else {
            pointQuadrant = 3;
        }
    }
    return pointQuadrant
}

//调用区域填充算法
function useFloodFill4() {
    document.querySelector("#tip").innerHTML = "算法可能需要一些时间，请等待不要额外的操作，完成后会在此处提示"
    setTimeout(function () {
        var startX = parseInt((pointsArray[0].x + pointsArray[parseInt(pointsArray.length / 2)].x) / 2) //种子点的选取：应尽量选取图形中间的位置，取第一个点和中间位置点的中点
        var startY = parseInt((pointsArray[0].y + pointsArray[parseInt(pointsArray.length / 2)].y) / 2)
        floodFill4(startX, startY, fillColor, "#ffffff")
        document.querySelector("#tip").innerHTML = "算法完成！"
    }, 100);

}

//区域填充：内点表示的四联通区域种子递归填充
function floodFill4(x, y, oldColor, newColor) {
    var step = 8; //递归填充的步长，最小为1，值越小需要越多的性能
    if (getPixelHex(x, y) == oldColor) {
        setPixel(x, y, newColor);
        floodFill4(x, y + step, oldColor, newColor);
        floodFill4(x, y - step, oldColor, newColor);
        floodFill4(x - step, y, oldColor, newColor);
        floodFill4(x + step, y, oldColor, newColor);
    }
}
//清空画布和存储的各种数据
function clearWorkArea() {
    initWorkArea(workW, workH, posX, posY, "#000000");
    isRight = true;
    yMin = 10000;
    yMax = 0;
    pointsArray = new Array();
    pointsArray.length = 0;
    linesArray = new Array();
    linesCount = 0;
    next = new Array();
    head = -1;
}
//调用转换算法将pointsArray[]中的点转换成直线段
function useDrawLine(pos) {
    var line //根据函数的参数判断使用哪一种转换算法
    if (pos == 0) {
        line = DDALine
    } else if (pos == 1) {
        line = BresenhamLine
    } else {
        line = IntergerBresenhamLine
    }
    if (pointsArray.length > 2) {
        for (var i = 0; i < pointsArray.length; i++) {
            line(pointsArray[i].x, pointsArray[i].y, pointsArray[(i + 1) % pointsArray.length].x, pointsArray[(i + 1) % pointsArray.length].y, fillColor); //如果点击的位置超过2，循环遍历数组，连接每2个点
        }
    } else {
        line(pointsArray[0].x, pointsArray[0].y, pointsArray[1].x, pointsArray[1].y, fillColor);
    }
}


//鼠标监听，每次点击鼠标，记录下点击的位置，存在pointsArray[]中
function mouseListener(event) {
    var x = event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft) - posX
    var y = workH - (event.clientY + (document.body.scrollTop || document.documentElement.scrollTop) - posY)
    if (x > 0 && x < workH && y > 0 && y < workH) { //判断点击位置的合法性
        setPixel(x, y, fillColor, 3);
        pointObj = {
            x: x,
            y: y
        }
        pointsArray[pointsArray.length] = pointObj;
    }

}


//DDA扫描转换算法，能够实现任意斜率的直线段转换
function DDALine(x0, y0, x1, y1, color) {
    var x, y, dx, dy, k, temp;
    dx = x1 - x0, dy = y1 - y0;
    k = dy / dx;
    if (dx < 0) { //二、三象限中的点转换起点和终点即可
        temp = x0;
        x0 = x1;
        x1 = temp;
        temp = y0;
        y0 = y1;
        y1 = temp;
    }
    if (Math.abs(k) <= 1) { //一、二象限中|k|<1 y随着x的变化而变化
        y = y0;
        for (x = x0; x <= x1; x++) {
            setPixel(x, int(y + 0.5), color);
            y = y + k;
        }
    } else if (k > 1) { //一象限中k>1 x随着y的变化而变化
        k = 1 / k;
        x = x0;
        for (y = y0; y <= y1; y++) {
            setPixel(int(x + 0.5), y, color);
            x = x + k;
        }
    } else if (k < -1) { //四象限中k<-1，注意此时的y0>y1，x随着y的减小而增大
        k = -1 / k;
        x = x0;
        for (y = y0; y >= y1; y--) {
            setPixel(int(x + 0.5), y, color);
            x = x + k;
        }
    }
}
//Bresenham扫描线转换，能够实现任意斜率的直线段转换
function BresenhamLine(x0, y0, x1, y1, color) {
    var x, y, dx, dy;
    var k, e;
    var xIncrement = (x1 - x0) > 0 ? 1 : -1;//根据dx的符号来判断x每次的增量是1还是-1
    var yIncrement = (y1 - y0) > 0 ? 1 : -1;//根据dy的符号来判断y每步的增量是1还是-1
    dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), k = dy / dx;
    e = -0.5, x = x0, y = y0;
    if (k < 1) {//斜率k小于1的时候，遍历x，根据e的符号来判断是否增加y
        for (var i = 0; i <= dx; i++) {
            setPixel(x, y, color);
            x = x + xIncrement, e = e + k;
            if (e >= 0) {
                y = y + yIncrement;
                e = e - 1;
            }
        }
    }
    else {//斜率k大于1的时候，遍历y，根据e的符号来判断是否增加x
        k = 1 / k;
        for (var i = 0; i <= dy; i++) {
            setPixel(x, y, color);
            y = y + yIncrement, e = e + k;
            if (e >= 0) {
                x = x + xIncrement;
                e = e - 1;
            }
        }
    }
}
//Bresenham改进扫描线转换：使用整数替代浮点运算
function IntergerBresenhamLine(x0, y0, x1, y1, color) {
    var x, y, dx, dy, e;
    var xIncrement = (x1 - x0) > 0 ? 1 : -1;//根据dx的符号来判断x每次的增量是1还是-1
    var yIncrement = (y1 - y0) > 0 ? 1 : -1;//根据dy的符号来判断y每步的增量是1还是-1
    dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    e = -dx, x = x0, y = y0;
    if ((dy / dx) < 1) {//斜率k小于1的时候，遍历x，根据e的符号来判断是否增加y
        for (var i = 0; i <= dx; i++) {
            setPixel(x, y, color);
            x = x + xIncrement, e = e + 2 * dy;;
            if (e >= 0) {
                y = y + yIncrement;
                e = e - 2 * dx;
            }
        }
    }
    else {//斜率k大于1的时候，遍历y，根据e的符号来判断是否增加x
        for (var i = 0; i <= dy; i++) {
            setPixel(x, y, color);
            y = y + yIncrement, e = e + 2 * dx;
            if (e >= 0) {
                x = x + xIncrement;
                e = e - 2 * dy;
            }
        }
    }
}

//以下代码无需改动，用于构建一个基本的工作环境，调用initWorkArea()函数即可，5个参数分别代表工作区的宽度，高度，左上角位置（x,y）和背景颜色
function initWorkArea(w, h, posx, posy, color) {
    divWork = createMyDiv(null, "divWork", w, h, posx, posy, "#000000"); //居中
    var bkcolor = color;
    noCanvas();
    defaultcvs = createCanvas(workW, workH);
    background(bkcolor);
    defaultcvs.parent(divWork);
}

function setPixel(x, y, color, size) {
    stroke(color);
    strokeWeight(size);
    point(x, workH - y);
}

function getPixelHex(x, y) {//返回像素颜色的hex值
    var clr;
    clr = get(x, workH - y);
    var pixelColor = "#";
    for (var i = 0; i < 3; i++) {
        var temp = clr[i].toString(16)
        if (temp.length < 2) {
            temp = "0" + temp;
        }
        pixelColor += temp
    }
    return pixelColor
}

function createMyDiv(parentele, id, w, h, posx, posy, bkstr) {
    var key, val;
    if (bkstr.match("#") || bkstr.match("rgb")) {
        key = "background-color";
        val = bkstr;
    }
    if (bkstr.match("url")) {
        key = "background";
        val = bkstr;
    }
    var div = createDiv();
    div.size(w, h);
    div.style(key, val);
    div.position(posx, posy);
    div.id(id);
    if (parentele != null) div.parent(parentele);
    return div;
}

function setup() {
    main();
}


function tagEdge() {
    this.xi = 0;
    this.dx = 0;
    this.ymax = 0;
    this.id = 0;
    this.isIn = false;
}
