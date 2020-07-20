/*无缝轮播图
 win String 元素选择器 要放入轮播图的窗口 选择器
 opts   json  实现轮播图的各种选项
        imgs 数组 要包含轮播图图片的数组
        links 数组 图片链接地址
        imgColor 数组 图片的颜色,用于全屏显示的颜色拼接
        imgSize 数组 第一个参数代表宽 第二个参数代表高度
        btnColor String 按钮的颜色
        btnActivity String 获得焦点的按钮的颜色
        btnPos 数组 第一个代表的是x位置 ,y位置
*/
function wheel(win, opts, runOpts) {

    // 参数的初始化
    var win = document.querySelector(win);

    if (!(win && win.nodeType == 1)) {
        console.error("窗口元素未获取到")
        return;
    }
    // 图片的地址添加一个
    opts.imgs.push(opts.imgs[0]);
    // 链接的地址添加一个
    opts.links.push(opts.links[0]);
    // 图片的颜色
    opts.imgColor.push(opts.imgColor[0]);

    var imgLength = opts.imgs.length;
    if (imgLength == 0) {
        console.error("没有传入相应的轮播内容")
        return;
    }
    var imgSize = opts.imgSize;
    if (!(imgSize instanceof Array)) {
        console.error("请传入合法的尺寸类型")
    }
    if (imgSize.length == 0) {
        imgSize[0] = document.documentElement.clientWidth;
        imgSize[1] = 400;
    }
    if (imgSize.some(function(val) {
            return val == 0;
        })) {
        for (var i = 0; i < imgSize.length; i++) {
            if (imgSize[i] == 0) {
                imgSize[i] = 500;
            }
        }
    }

    var btnColor = opts.btnColor || "green";
    var btnActive = opts.btnActive || "red";

    var btnPos = opts.btnPos || ["center", "10"];

    var runOpts = runOpts || {};
    var time = 0;
    if (runOpts.time) {
        time = runOpts.time * 1000;
    } else {
        time = 5000;
    }
    var eachTime = 0;
    if (runOpts.eachTime) {
        eachTime = runOpts.eachTime * 1000;
    } else {
        eachTime = 500;
    }

    var runStyle = null;
    if (runOpts.runStyle == "linear" || !(runOpts.runStyle)) {
        runStyle = Tween.Linear;
    } else if (runOpts.runStyle == "in") {
        runStyle = Tween.Quad.easeIn;
    } else if (runOpts.runStyle == "out") {
        runStyle = Tween.Quad.easeOut;
    }
    /*创建html结构和样式
     */
    //1. win样式

    win.style.cssText = "width:100%;height:" + imgSize[1] + "px;overflow:hidden;position:relative;";
    //添加容器
    var box = document.createElement("div");
    box.style.cssText = "width:" + imgLength * 100 + "%;height:100%;border:1px solid black;";
    win.appendChild(box);
    // 创建每一个轮播图
    for (var i = 0; i < imgLength; i++) {
        var divList = document.createElement("div");
        divList.style.cssText = `float: left;width: ${100/imgLength}%;height: 100%;background:${opts.imgColor[i]}`;
        box.appendChild(divList);
        var link = document.createElement("a");
        link.href = opts.links[i];
        link.style.cssText = "width:" + imgSize[0] + "px;height:" + imgSize[1] + "px;display:block;margin:auto;background:url(" + opts.imgs[i] + ") no-repeat 0 0;"
        divList.appendChild(link);
    }

    var btnBox = document.createElement("div");
    btnBox.style.cssText = "width:200px;height:50px; position: absolute;left:0;right:0;margin:auto;bottom:" + btnPos[1] + "px;display: flex; align-items: center;justify-content: space-around;"
    var btns = [];


    for (var i = 0; i < imgLength - 1; i++) {
        var bgcolor = i == 0 ? btnActive : btnColor;
        var btn = document.createElement("div");
        btn.style.cssText = "width:55px;height:10px;background:" + bgcolor + ";border-radius:15%;cursor:pointer";
        btnBox.appendChild(btn);
        btns.push(btn);
    }

    win.appendChild(btnBox);
    // var win = document.
    // getElementsByClassName("window")[0];
    // // 获得大的容器的对象
    // var box = document.getElementsByClassName("box")[0];
    // // 获取按钮的集合
    // var btns = document.querySelectorAll(".btns li");


    // 即时完成 
    //如何获得窗口的大小
    // console.log(window.innerWidth);
    // console.log(document.documentElement.clientWidth);
    // 获得轮播的运动的长度
    var winW = parseInt(getComputedStyle(win, null).width);
    // 轮播的初始位置
    var num = 0;

    // 运动函数
    function move() {
        // 每一次轮播要加一
        num++;
        // 当运动到最后一张的处理逻辑
        if (num > btns.length - 1) {
            // 当处理完最后一张，需要即时回到第一次张 
            animate(box, {
                    "margin-left": -num * winW
                }, eachTime, runStyle, function() {
                    // num = 0;
                    box.style.marginLeft = 0;
                })
                // 将位置再回拨到第一张
            num = 0;
        } else {
            // 除了最后一张以外的运动方式
            animate(box, {
                "margin-left": -num * winW
            }, eachTime, runStyle)
        }
        // 按钮随着轮播的变化而变化
        for (var i = 0; i < btns.length; i++) {
            btns[i].style.background = btnColor;
        }
        btns[num].style.background = opts.btnActive;

    }
    // 没隔3S运动一次
    var t = setInterval(move, time);
    //按钮轮播
    // 通过按钮进行切换
    for (let i = 0; i < btns.length; i++) {
        // 给每一个按钮添加事件
        btns[i].onclick = function() {
            num = i; //将当前点击的按钮和轮播的值进行关联
            // 点击时候的运动方式
            animate(box, {
                "margin-left": -num * winW
            }, eachTime, runStyle)

            // 点击的时候按钮的变化
            for (var j = 0; j < btns.length; j++) {
                btns[j].style.background = btnColor;
            }
            btns[num].style.background = btnActive;
        }
    }

    // 鼠标的移入移出  事件里面最复杂的一个事件
    // 当鼠标移入的时候,停止轮播
    win.onmouseover = function() {
            clearInterval(t);
        }
        // 当鼠标离开的时候,继续轮播
    win.onmouseout = function() {
        t = setInterval(move, time);
    }
}