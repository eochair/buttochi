class Button {
    constructor(func, thisObject, str="", img=undefined,
        defaultColor=r200Color, 
        borderColor=blackColor, 
        textColor=whiteColor,
        clickedColor=undefined,
        fontSize=16, fontName="Meirio") {

        this.func = func;
        this.thisObject = thisObject;
        this.str = str;
        this.fontSize = fontSize;
        this.fontName = fontName;
        this.activeFlag = false;
        this.img = img;
        this.buttonColor = defaultColor;
        this.defaultColor = defaultColor;
        this.borderColor = borderColor;
        this.textColor = textColor;
        this.clickedColor = clickedColor;
    }

    get getFunc() {
        return this.func;
    }

    get isActiveFlag() {
        return this.activeFlag;
    }

    setFunc(func) {
        this.func = func;
    }

    setActiveFlag(activeFlag) {
        this.activeFlag = activeFlag;
    }

    setString(str) {
        this.str = str;
    }

    setButtonSelectColor(buttonSelectColor) {
        this.borderColor = buttonSelectColor;
    }

    draw(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = this.fontSize+"px "+this.fontName;
        if(this.img == undefined) {
            ctx.fillStyle = this.buttonColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.textColor;
            var indexText=0;
            for(var line of this.str.split("\n")) {
                ctx.fillText(line, this.x+this.width/2,
                    this.y+this.height/2+indexText*this.fontSize,
                    this.width, this.height);
                indexText += 1;
            }
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        this.drawSelectedRect(this.borderColor);
    }

    drawSelectedRect(buttonSelectColor=blackColor) {
        if(this.activeFlag) {
            var lineMargin = 5;
            ctx.strokeStyle = buttonSelectColor;
            ctx.strokeRect(this.x-lineMargin, this.y-lineMargin, 
                this.width+lineMargin*2, this.height+lineMargin*2);
        }
    }

    mouseDownListener(e, args=undefined) {
        if(this.checkButtonRange(e)) {
            this.changeClickedColor();
            this.func.call(this.thisObject, args);
        }
    }

    mouseUpListener(e) {
        // mouseup out of range
        this.changeDefaultColor();
    }

    // for avoid popup block
    mouseUpListenerWithFunc(e, args=undefined) {
        this.changeDefaultColor();
        if(this.checkButtonRange(e)) {
            this.func.call(this.thisObject, args);
        }
    }

    mouseMoveListener(e) {
        if(this.checkButtonRange(e)) {
            this.setActiveFlag(true);
        } else {
            this.setActiveFlag(false);
        }
    }
    
    clickListener(e, args=undefined) {
        if(this.checkButtonRange(e)) {
            this.func.call(this.thisObject, args);
        }
    }  

    changeDefaultColor() {
        if(this.img == undefined && this.clickedColor != undefined) {
            this.buttonColor = this.defaultColor;
        }
    }

    changeClickedColor() {
        if(this.img == undefined && this.clickedColor != undefined) {
            this.buttonColor = this.clickedColor;
        }
    }

    checkButtonRange(e) {
        var ret = false;

        var button = e.target.getBoundingClientRect();
        var mouseX = e.clientX - button.left;
        var mouseY = e.clientY - button.top;
        if(this.x < mouseX && mouseX < this.x + this.width){
            if(this.y < mouseY && mouseY < this.y + this.height){
                ret = true;
            }
        }

        return ret;
    }
}


var stateFightEnum = {
    NEUTRAL : 0,
    ATTACK : 1,
    DODGE : 2
};

class Character {
    constructor() {
        this.img = new Image();
        this.setIndexImg(0);
        this.stateFight = stateFightEnum.NEUTRAL;
        this.coolTime = 0;
        this.animeTime = 0;
        this.stability = 0.0;
    }

    get getStateFight() {
        return this.stateFight;
    }

    get getCoolTime() {
        return this.coolTime;
    }
    
    get getAnimeTime() {
        return this.animeTime;
    }

    get getStability() {
        return this.stability;
    }
    
    get getAttackPoint() {
        return this.attackPoint;
    }

    get getRestorePoint() {
        return this.restorePoint;
    }

    setImg(img) {
        this.img = img;
    }

    setIndexImg(indexImg) {
        this.indexImg = indexImg;
        this.charData = charList[this.indexImg];
        this.img.src = this.charData.srcNormal;
        this.charHeight = this.charData.height;
        this.charWeight = this.charData.weight;
        this.charBust = this.charData.bust;
        this.charWaist = this.charData.waist;
        this.charHip = this.charData.hip;
        this.attackPoint = this.charHip*2+this.charWeight;
        this.restorePoint = (this.charHeight/this.charWeight)/2
    }

    setNormalImg() {
        this.img.src = this.charData.srcNormal;
    }

    setDodgeImg() {
        this.img.src = this.charData.srcDodge;
    }

    setAttackImg() {
        this.img.src = this.charData.srcAttack;
    }

    setStateFight(stateFight) {
        this.stateFight = stateFight;
    }
    
    setCoolTime(coolTime) {
        this.coolTime = coolTime;
    }

    setAnimeTime(animeTime) {
        this.animeTime = animeTime;
    }

    setStability(stability) {
        this.stability = stability;
    }

    restoreStability() {
        if(this.stability < 0) {
            this.stability = 0<this.stability+this.restorePoint ? 0 : this.stability+this.restorePoint;
        } else if(0 < this.stability) {
            this.stability = this.stability-this.restorePoint<0 ? 0 : this.stability-this.restorePoint;
        }
    }

    draw(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        if(this.img == undefined) {
            ctx.fillStyle = r200Color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}


class Bar {
    constructor(minValue=-100, maxValue=100) {
        this.value = 0;
        this.maxValue = maxValue;
        this.minValue = minValue;
    }

    draw(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var grad  = ctx.createLinearGradient(this.x, 0, this.x+this.width, 0);
        grad.addColorStop(0, redColor);
        grad.addColorStop(0.25, yellowColor);
        grad.addColorStop(0.5, r160greenColor);
        grad.addColorStop(0.75, yellowColor);
        grad.addColorStop(1, redColor);
        ctx.fillStyle = grad;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        var position = Math.floor(this.width * (this.value-this.minValue+1)/(this.maxValue-this.minValue+1));
        ctx.fillStyle = blackColor;
        var margin = 10;
        ctx.fillRect(this.x+position-this.width/30/2, this.y-margin/2, this.width/30, this.height+margin);
    }

    setValue(value) {
        if(value < this.minValue) {
            this.value = this.minValue;
        } else if(this.maxValue < value) {
            this.value = this.maxValue;
        } else {
            this.value = value;
        }
    }
}
	
function getLength(str){
    var len = 0;
    for(var char of str){
        char = escape(char);
        if(char.match(/^\%u/)) {
            len += 2;
        } else {
            len += 1;
        }
  }

  return len;
};