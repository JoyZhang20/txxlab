var divWork;
var workW = 800,
    workH = 800;
var posX = 600,
    posY = 100;
var pointsArray = new Array(); //存储点
var ymin = 10000;
var ymax = 0;
var fillColor = "#ff0000"; //填充颜色，待解决：十进制转换十六进制中的位数丢失问题
var grayingColor = "#999999";

function main() {
    initWorkArea(workW, workH, posX, posY, "#000000");
}


function useThree(){
    window.location.href='three.html';
}


//利用圆的方程画出一个正方形的内切圆，根据每个点的所属范围进行不同的涂色
function showRGB() {
    for (var i = 200; i <= 400; i++) {
        for (var j = 200; j <= 400; j++) {
            if (isInCilrcle(100, 300, 300, i, j))
                setPixel(i, j, "#00ff00");
        }
    }
    for (var i = 300; i <= 500; i++) {
        for (var j = 200; j <= 400; j++) {
            if (isInCilrcle(100, 400, 300, i, j) && isInCilrcle(100, 300, 300, i, j)) {
                setPixel(i, j, "#00ffff");
            } else if (isInCilrcle(100, 400, 300, i, j)) {
                setPixel(i, j, "#0000ff");
            }
        }
    }
    for (var i = 250; i <= 450; i++) {
        for (var j = 300; j <= 500; j++) {
            if (isInCilrcle(100, 350, 400, i, j) && isInCilrcle(100, 400, 300, i, j) && isInCilrcle(100, 300, 300, i, j)) {
                setPixel(i, j, "#ffffff");
            } else if (isInCilrcle(100, 350, 400, i, j) && isInCilrcle(100, 400, 300, i, j)) {
                setPixel(i, j, "#ff00ff");
            } else if (isInCilrcle(100, 350, 400, i, j) && isInCilrcle(100, 300, 300, i, j)) {
                setPixel(i, j, "#ffff00");
            } else if (isInCilrcle(100, 350, 400, i, j)) {
                setPixel(i, j, "#ff0000");
            }
        }
    }


}
//利用圆的方程来判断点(x,y)是否在原点为(x0,y0)半径为r的圆内
function isInCilrcle(r, x0, y0, x, y) {
    return (x - x0) * (x - x0) + (y - y0) * (y - y0) <= r * r ? 1 : 0
}

//调用二阶贝塞尔算法，画出对应曲线
function useDoubleBezier() {
    for (var j = 0.001; j < 1; j += 0.001) {
        setPixel(doubleBezier(j, pointsArray[0], pointsArray[1], pointsArray[2]).x, doubleBezier(j, pointsArray[0],
            pointsArray[1], pointsArray[2]).y, "#ff0000", 2);
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


//待完善：点在多边形边界，能否判断出来？
//弧长累进算法：判断点与多边形关系，顺时针或逆时针皆可
function usePointPosition() {
    var originX = pointsArray[pointsArray.length - 1].x; //以最后一个点作为原点，建立坐标系，判断其余点的象限
    var originY = pointsArray[pointsArray.length - 1].y;
    var arcLength = 0; //弧长
    var pointsQuadrant = new Array(); //存储点的象限信息
    for (var i = 0; i < pointsArray.length - 1; i++) { //遍历点获取每个点的象限
        pointsQuadrant[i] = getQuadrant(originX, originY, pointsArray[i].x, pointsArray[i].y)
        // console.log("第" + i + "次象限为" + pointsQuadrant[i]);
    }
    for (var i = 0; i < pointsArray.length - 1; i++) { //遍历每两个点，计算两者间象限的差值
        var quadrantDiff = (pointsQuadrant[(i + 1) % (pointsArray.length - 1)] - pointsQuadrant[i] + 4) % 4; //保证循环的安全及象限差值的合法性
        // console.log("quadrantDiff=" + quadrantDiff);
        if (quadrantDiff == 0) { //对象限差值的不同情况进行累计弧长
            arcLength += 0;
        } else if (quadrantDiff == 1) {
            arcLength += Math.PI / 2;
        } else if (quadrantDiff == 3) {
            arcLength -= (Math.PI / 2);
        } else if (quadrantDiff == 2) { //差值为2时需要一些额外的判断
            var f = ((pointsArray[(i + 1) % (pointsArray.length - 1)].y - originY) * (pointsArray[i].x - originX)) - //注意是相对于原点的x、y作运算
                ((pointsArray[(i + 1) % (pointsArray.length - 1)].x - originX) * (pointsArray[i].y - originY));
            // console.log("f=" + f);
            // console.log(pointsArray[i].x + "," + pointsArray[i].y + "," + pointsArray[(i + 1) % (pointsArray.length - 1)].x + "," + pointsArray[(i + 1) % (pointsArray.length - 1)].y);
            if (f > 0) {
                arcLength += Math.PI;
            } else if (f < 0) {
                arcLength -= Math.PI;
            }
        }
        // console.log("第" + i + "次的arclenth为" + arcLength);
    }
    var result = ""
    arcLength = Math.abs(arcLength) //取绝对值以实现不同方向的判断
    // console.log("最终的arcLenth=" + arcLength);
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
    if (getPixel(x, y) == oldColor) {
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
    ymin = 10000;
    ymax = 0;
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
        line = Bresenhamline
    } else {
        line = IntergerBresenhamline
    }
    if (pointsArray.length > 2) {
        for (var i = 0; i < pointsArray.length; i++) {
            line(pointsArray[i].x, pointsArray[i].y, pointsArray[(i + 1) % pointsArray.length].x, pointsArray[(i + 1) % pointsArray.length].y, fillColor); //如果点击的位置超过2，循环遍历数组，连接每2个点
        }
    } else {
        line(pointsArray[0].x, pointsArray[0].y, pointsArray[1].x, pointsArray[1].y, fillColor);
    }
}


//鼠标监听，每次点击鼠标，记录下点击的位置，存在points中
function mouseListener(event) {
    var x = event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft) - posX
    var y = workH - (event.clientY + (document.body.scrollTop || document.documentElement.scrollTop) - posY)
    if (x > 0 && x < workH && y > 0 && y < workH) { //判断点击位置的合法性
        setPixel(x, y, fillColor, 3);
        pointObj = {
            x: x,
            y: y
        }
        if (y > ymax) {
            ymax = y;
        }
        if (y < ymin) {
            ymin = y;
        }
        pointsArray[pointsArray.length] = pointObj;
    }

}
//扫描线算法：将扫描线转换为多边形
function usePolyFill(polyFillColor) {

    var linesArray = new Array(); //把所有的边打个标号放入
    var linesCount = 0;

    var next = new Array(); //Lines[next[i]]:即为下一条边
    var head = -1; //活动边表的头
    DDALine(pointsArray[0].x, pointsArray[0].y, pointsArray[pointsArray.length - 1].x, pointsArray[pointsArray.length - 1].y, polyFillColor);
    //定义一个新边表（NET）
    var slNet = new Array(ymax - ymin + 1);
    for (var i = 0; i < slNet.length; i++)
        slNet[i] = []; //生成二维数组
    //初始化新边表
    InitNET();
    //进行扫描线填充
    ProcessScanLineFill(polyFillColor);
    /*-----------END----------*/
    function InitNET() {
        for (var i = 0; i < pointsArray.length; i++) {
            var e = new tagEdge();
            e.id = linesCount++;
            e.isIn = false;
            var L_start = pointsArray[i]; //边的第一个顶点
            var L_end = pointsArray[(i + 1) % pointsArray.length]; //边的第二个顶点
            var L_start_pre = pointsArray[(i - 1 + pointsArray.length) % pointsArray.length]; //第一个顶点前面的点
            var L_end_next = pointsArray[(i + 2) % pointsArray.length]; //第二个顶点后面的点
            if (L_end.y != L_start.y) { //跳过水平线
                e.dx = (L_end.x - L_start.x) / (L_end.y - L_start.y); //1/k
                if (L_end.y > L_start.y) {
                    e.xi = L_start.x;
                    if (L_end_next.y >= L_end.y) {
                        e.ymax = L_end.y - 1;
                    } else e.ymax = L_end.y;

                    slNet[L_start.y - ymin].push(e);
                } else {
                    e.xi = L_end.x;
                    if (L_start_pre.y >= L_start.y) {
                        e.ymax = L_start.y - 1;
                    } else e.ymax = L_start.y;

                    slNet[L_end.y - ymin].push(e);
                }
                linesArray.push(e);
            }
        }
        var tp = new tagEdge(); //javascript中不允许数组为空，因此这里填入一个空边
        for (var i = 0; i < slNet.length; i++) {
            slNet[i].push(tp);
        }

    }

    function ProcessScanLineFill(polyFillColor) {
        //初始化活动边表的信息
        head = -1;
        for (var i = 0; i < linesArray.length; i++)
            next[i] = -1;
        /*----开始扫描线算法---*/
        for (var y = ymin; y <= ymax; y++) {
            insert(y - ymin); //插入新边
            for (var i = head; i != -1; i = next[next[i]]) { //绘制该扫描线
                if (next[i] != -1) {
                    // drawLine(Lines[i].xi, y, Lines[next[i]].xi, y);
                    DDALine(linesArray[i].xi, y, linesArray[next[i]].xi, y, polyFillColor);
                }
            }
            remove(y); //删除非活动边
            update_AET(); //更新活动边表中每项的xi值，并根据xi重新排序
        }
        /*----END扫描线算法---*/


        /*----扫描线算法所需的函数---*/
        //删除非活动边
        function remove(y) {
            var pre = head;
            while (head != -1 && linesArray[head].ymax == y) {
                linesArray[head].isIn = false;
                head = next[head];
                next[pre] = -1;
                pre = head;
            }
            if (head == -1) return;
            var nxt = next[head];
            for (var i = nxt; i != -1; i = nxt) {
                nxt = next[i];
                if (linesArray[i].ymax == y) {
                    next[pre] = next[i];
                    linesArray[i].isIn = false;
                    next[i] = -1;
                } else pre = i;
            }
        }

        //更新活动边表中每项的xi值，并根据xi重新排序
        function update_AET() {
            for (var i = head; i != -1; i = next[i]) {
                linesArray[i].xi += linesArray[i].dx;
            }
            //按照冒泡排序的思想O(n)重新排序
            if (head == -1) return;
            if (next[head] == -1) return;
            var pre = head;
            if (linesArray[head].xi > linesArray[next[head]].xi) {
                head = next[head];
                next[pre] = next[head];
                next[head] = pre;
                pre = head;
            }
            var j = next[head];
            for (var i = j; i != -1; i = j) {
                j = next[i];
                if (j == -1) break;
                if (linesArray[i].xi > linesArray[next[i]].xi) {
                    next[pre] = next[i];
                    next[i] = next[next[i]];
                    next[j] = i;
                } else pre = i;
            }
        }

        //将扫描线对应的所有新边插入到AET中
        function insert(y) {
            for (var i = 0; i < slNet[y].length; i++) {
                var temp = slNet[y][i];

                if (temp.ymax == 0 && temp.dx == 0) break;

                if (head == -1) {
                    head = temp.id;
                } else {
                    if (temp.xi < linesArray[head].xi) {
                        next[temp.id] = head;
                        head = temp.id;
                    } else {
                        var pre = head;
                        for (var j = next[head]; ; j = next[j]) {
                            if (j == -1 || temp.xi < linesArray[j].xi) {
                                next[pre] = temp.id;
                                next[temp.id] = j;
                                break;
                            }
                            pre = j;
                        }
                    }
                }
                temp.isIn = true;
            }
        }

    }
}



function DDALine(x0, y0, x1, y1, color) { //DDA转换，能够实现任意斜率的直线段转换
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



function Bresenhamline(x0, y0, x1, y1, color) {
    var x, y, dx, dy;
    var k, e;
    dx = x1 - x0, dy = y1 - y0, k = dy / dx;
    e = -0.5, x = x0, y = y0;
    for (var i = 0; i <= dx; i++) {
        setPixel(x, y, color);
        x = x + 1, e = e + k;
        if (e >= 0) {
            y++;
            e = e - 1;
        }
    }

}

function IntergerBresenhamline(x0, y0, x1, y1, color) {
    var x, y, dx, dy, e;
    dx = x1 - x0, dy = y1 - y0;
    e = -dx, x = x0, y = y0;
    for (var i = 0; i <= dx; i++) {
        setPixel(x, y, color);
        x++;
        e = e + 2 * dy;
        if (e >= 0) {
            y++;
            e = e - 2 * dx;
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

function getPixel(x, y) {
    var clr;
    clr = get(x, workH - y);
    return [clr[0], clr[1], clr[2], clr[3]];
}

function getPixel2(x, y) {
    var clr;
    clr = get(x, workH - y);
    // return [clr[0], clr[1], clr[2], clr[3]];
    var pixelColor = "#";
    for (var i = 0; i < 3; i++) {
        var temp = clr[i].toString(16)
        // console.log(temp.length);
        if (temp.length < 2) {
            temp = "0" + temp;
        }
        pixelColor += temp
    }
    return pixelColor
}

function switchColorForm(clr) {
    var pixelColor = "#";
    for (var i = 0; i < 3; i++) {
        var temp = clr[i].toString(16)
        // console.log(temp.length);
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
    this.dx = 0; //  1/k
    this.ymax = 0;
    this.id = 0;
    this.isIn = false;
}
