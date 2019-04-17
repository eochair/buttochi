
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.lineWidth = 5;
ctx.lineJoin = "round";
ctx.shadowBlur = 5;
ctx.shadowColor = gray128a05Color;

var startView;
var selectView;
var fightView;

var backgroundImg = new Image();
var ctrImg = new Image();
var cableImg = new Image();
var dummyFunc = function dummy() {};

var titleStrJa = "尻餅";
var titleStrEn = "Buttochi";

var charRow = 2;
var charCol = 3;
var charImgHeight = canvas.height/(charRow+1);
var charImgWidth = canvas.width/(charCol+1)/2;

var mSecondDraw = 10;

var drawStateEnum = {
    START : 0,
    SELECT : 1,
    FIGHT : 2
};
var drawState = drawStateEnum.START;
main();

function main() {
    ctx.font = fontSize12Px+fontMeirio;
    startView = new StartView();
    selectView = new SelectView();
    fightView = new FightView();

    backgroundImg = new Image();
    backgroundImg.src = "res/dohyo.png";

    ctrImg = new Image();
    ctrImg.src = "res/ctr.png";

    cableImg = new Image();
    cableImg.src = "res/cable.png";
    
    document.addEventListener("keydown", keyDownListner, false);
    document.addEventListener("keyup", keyUpListener, false);
    canvas.addEventListener("mousedown", mouseDownListener, false);
    canvas.addEventListener("mouseup", mouseUpListener, false);
    canvas.addEventListener("mousemove", mouseMoveListener, false);
    canvas.addEventListener("click", clickListener, false);
    setInterval(draw, mSecondDraw);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(ctrImg, canvas.width/50, canvas.height/2-canvas.height/4, canvas.width/4, canvas.height/4);
    ctx.drawImage(cableImg, canvas.width/50+canvas.width/4/2, canvas.height/2, canvas.width/4, canvas.height/4);
    ctx.setTransform(-1, 0, 0, 1, canvas.width/4, 0);
    ctx.drawImage(ctrImg, -(canvas.width-canvas.width/50-canvas.width/4), canvas.height/2-canvas.height/4, canvas.width/4, canvas.height/4);
    ctx.drawImage(cableImg, -((canvas.width-canvas.width/50-canvas.width/4)-canvas.width/4/2), canvas.height/2, canvas.width/4, canvas.height/4);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    fightView.drawBackgroundButton();
    
    ctx.drawImage(backgroundImg, canvas.width/12, 9*canvas.height/16, 10*canvas.width/12, canvas.height/2);
    if(drawState==drawStateEnum.START) {
        startView.draw();
    } else if(drawState==drawStateEnum.SELECT) {
        selectView.draw();
    } else if(drawState==drawStateEnum.FIGHT) {
        fightView.draw();
    }
}

function keyDownListner(e) {
    if(drawState == drawStateEnum.START) {
        startView.keyDownListner(e);
    } else if(drawState == drawStateEnum.SELECT) {
        selectView.keyDownListner(e);
    } else if(drawState == drawStateEnum.FIGHT) {
        fightView.keyDownListner(e);
    }
}

function keyUpListener(e) {
    if(drawState == drawStateEnum.START) {
    } else if(drawState == drawStateEnum.SELECT) {
    } else if(drawState == drawStateEnum.FIGHT) {
        fightView.keyUpListener(e);
    }
}

function mouseDownListener(e) {
    if(drawState == drawStateEnum.START) {
        fightView.mouseDownListener(e);
    } else if(drawState == drawStateEnum.SELECT) {
    } else if(drawState == drawStateEnum.FIGHT) {
        fightView.mouseDownListener(e);
    }
}

function mouseUpListener(e) {
    if(drawState == drawStateEnum.START) {
        startView.mouseUpListener(e);
        fightView.mouseUpListener(e);
    } else if(drawState == drawStateEnum.SELECT) {
    } else if(drawState == drawStateEnum.FIGHT) {
        fightView.mouseUpListener(e);
    }
}

function mouseMoveListener(e) {
    if(drawState == drawStateEnum.START) {
        startView.mouseMoveListener(e);
    } else if(drawState == drawStateEnum.SELECT) {
        selectView.mouseMoveListener(e);
    } else if(drawState == drawStateEnum.FIGHT) {
        fightView.mouseMoveListener(e);
    }
}

function clickListener(e) {
    if(drawState == drawStateEnum.START) {
        startView.clickListener(e);
    } else if(drawState == drawStateEnum.SELECT) {
        selectView.clickListener(e);
    } else if(drawState == drawStateEnum.FIGHT) {
        fightView.clickListener(e);
    }
}
