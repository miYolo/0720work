/*无缝轮播图
 wins String 元素选择器 要放入轮播图的窗口 选择器
 opts   json  实现轮播图的各种选项
        imgs 数组 要包含轮播图图片的数组
        links 数组 图片链接地址
        imgColor 数组 图片的颜色,用于全屏显示的颜色拼接
        imgSize 数组 第一个参数代表宽 第二个参数代表高度
        btnColor String 按钮的颜色
        btnActivity String 获得焦点的按钮的颜色
        btnPos 数组 第一个代表的是x位置 ,y位置
*/
function wheel(wins, opts) {

    // 参数的初始化
    var wins = document.querySelector(wins);

    if (!(wins && wins.nodeType == 1)) {
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


    /*创建html结构和样式
     */
    //1. win样式

    wins.style.cssText = "width:100%;height:" + imgSize[1] + "px;overflow:hidden;position:relative;";
    //添加容器
    var box = document.createElement("div");
    box.style.cssText = "width:" + imgLength * 100 + "%;height:100%;border:1px solid black;";
    wins.appendChild(box);
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
    wins.appendChild(btnBox);

    for (var i = 0; i < imgLength - 1; i++) {
        var bgcolor = i == 0 ? btnActive : btnColor;
        var btns = document.createElement("div");
        btns.style.cssText = "width:55px;height:10px;background:" + bgcolor + ";border-radius:15%;cursor:pointer";
        btnBox.appendChild(btns);
    }
}