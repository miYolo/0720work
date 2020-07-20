function wheel(win, opts, runOpts) {
    // 初始化参数
    this.init(win, opts, runOpts);
    // 获取窗口
    this.getWin();
    // 创建盒子
    this.createBox();
    // 创建轮播列表
    this.createList();
    // 创建按钮
    this.createBtn();
    //自动轮播
    this.autoRun();
    // 点击播放
    // this.clickRun();
}

wheel.prototype = {
    init(win, opts, runOpts) {
        this.opts = opts;
        this.runOpts = runOpts;
        var win = document.querySelector(win);

        if (!(win && win.nodeType == 1)) {
            console.error("窗口元素未获取到")
            return;
        }

        this.win = this.win = win;
        // 图片的地址添加一个
        opts.imgs.push(opts.imgs[0]);
        // 链接的地址添加一个
        opts.links.push(opts.links[0]);
        // 图片的颜色
        opts.imgColor.push(opts.imgColor[0]);

        this.imgLength = opts.imgs.length;
        if (this.imgLength == 0) {
            console.error("没有传入相应的轮播内容")
            return;
        }
        this.imgSize = opts.imgSize;
        if (!(this.imgSize instanceof Array)) {
            console.error("请传入合法的尺寸类型")
        }
        if (this.imgSize.length == 0) {
            this.imgSize[0] = document.documentElement.clientWidth;
            this.imgSize[1] = 400;
        }
        if (this.imgSize.some(function(val) {
                return val == 0;
            })) {
            for (var i = 0; i < this.imgSize.length; i++) {
                if (this.imgSize[i] == 0) {
                    this.imgSize[i] = 500;
                }
            }
        }

        this.btnColor = opts.btnColor || "green";
        this.btnActive = opts.btnActive || "red";

        this.btnPos = opts.btnPos || ["center", "10"];

        this.runOpts = runOpts || {};
        this.time = 0;
        if (runOpts.time) {
            this.time = runOpts.time * 1000;
        } else {
            this.time = 5000;
        }
        this.eachTime = 0;
        if (runOpts.eachTime) {
            this.eachTime = runOpts.eachTime * 1000;
        } else {
            this.eachTime = 500;
        }

        this.runStyle = null;
        if (runOpts.runStyle == "linear" || !(runOpts.runStyle)) {
            this.runStyle = Tween.Linear;
        } else if (runOpts.runStyle == "in") {
            this.runStyle = Tween.Quad.easeIn;
        } else if (runOpts.runStyle == "out") {
            this.runStyle = Tween.Quad.easeOut;
        }
    },
    getWin() {
        this.win.style.cssText = "width:100%;height:" + this.imgSize[1] + "px;overflow:hidden;position:relative;";
    },
    createBox() {
        this.box = document.createElement("div");
        this.box.style.cssText = "width:" + this.imgLength * 100 + "%;height:100%;border:1px solid black;";
        this.win.appendChild(this.box);
    },
    createList() {
        for (var i = 0; i < this.imgLength; i++) {
            var divList = document.createElement("div");
            divList.style.cssText = `float: left;width: ${100/this.imgLength}%;height: 100%;background:${this.opts.imgColor[i]}`;

            var link = document.createElement("a");
            link.href = this.opts.links[i];
            link.style.cssText = "width:" + this.imgSize[0] + "px;height:" + this.imgSize[1] + "px;display:block;margin:auto;background:url(" + this.opts.imgs[i] + ") no-repeat 0 0;"
            divList.appendChild(link);
            this.box.appendChild(divList);
        }
    },
    createBtn() {
        var btnBox = document.createElement("div");
        btnBox.style.cssText = "width:200px;height:50px; position: absolute;left:0;right:0;margin:auto;bottom:" + this.btnPos[1] + "px;display: flex; align-items: center;justify-content: space-around;"
        this.btns = [];

        for (var i = 0; i < this.imgLength - 1; i++) {
            var bgcolor = i == 0 ? this.btnActive : this.btnColor;
            var btn = document.createElement("div");
            btn.style.cssText = "width:55px;height:10px;background:" + bgcolor + ";border-radius:15%;cursor:pointer";
            btnBox.appendChild(btn);
            this.btns.push(btn);
        }

        this.win.appendChild(btnBox);

    },

    autoRun() {

        var winW = parseInt(getComputedStyle(this.win, null).width);
        // 轮播的初始位置
        var num = 0;

        // 运动函数
        function move() {
            // 每一次轮播要加一
            num++;
            // 当运动到最后一张的处理逻辑
            if (num > btnss.btns.length - 1) {
                // 当处理完最后一张，需要即时回到第一次张 
                animate(box, {
                        "margin-left": -num * winW
                    }, this.eachTime, this.runStyle, function() {
                        // num = 0;
                        box.style.marginLeft = 0;
                    })
                    // 将位置再回拨到第一张
                num = 0;
            } else {
                // 除了最后一张以外的运动方式
                animate(box, {
                    "margin-left": -num * winW
                }, this.eachTime, this.runStyle)
            }
            // 按钮随着轮播的变化而变化
            for (var i = 0; i < btnss.btns.length; i++) {
                btns[i].style.background = this.btnColor;
            }
            btns[num].style.background = this.opts.btnActive;
        }
        var t = setInterval(move, this.time);
    },
    // clickRun() {
    //     for (let i = 0; i < btns.length; i++) {
    //         // 给每一个按钮添加事件
    //         btns[i].onclick = function() {
    //             num = i; //将当前点击的按钮和轮播的值进行关联
    //             // 点击时候的运动方式
    //             animate(box, {
    //                 "margin-left": -num * winW
    //             }, this.eachTime, this.runStyle)

    //             // 点击的时候按钮的变化
    //             for (var j = 0; j < btns.length; j++) {
    //                 btns[j].style.background = this.btnColor;
    //             }
    //             btns[num].style.background = this.btnActive;
    //         }
    //     }

    //     // 鼠标的移入移出  事件里面最复杂的一个事件
    //     // 当鼠标移入的时候,停止轮播
    //     this.win.onmouseover = function() {
    //             clearInterval(t);
    //         }
    //         // 当鼠标离开的时候,继续轮播
    //     this.win.onmouseout = function() {
    //         t = setInterval(move, this.time);
    //     }
    // }
}