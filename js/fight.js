var myData;
class FightView {
    constructor() {
        this.indexSlectedCharList = [-1, -1];

        this.keepPushingFlag = false;

        this.charHeight = canvas.height/2;
        this.charWidth = canvas.width/3;
        
        this.maxPreAttackTime = 3;
        this.maxPreDodgeTime = 5;

        this.charLeft = new Character();
        this.charRight = new Character();

        this.playerAnimeTime = mSecondDraw*30;
        this.playerCoolTime = mSecondDraw*60;
        this.comAnimeTime = mSecondDraw*30;
        this.comCoolTime = mSecondDraw*60;

        this.stabilityMax = 1000;
        this.stabilityMin = -1000;
        this.barLeft = new Bar(this.stabilityMin, this.stabilityMax);
        this.barRight = new Bar(this.stabilityMin, this.stabilityMax);

        this.timerButton = new Button(dummyFunc, this, "", undefined, 
                                        gray64Color, undefined, undefined, undefined, 30);

        this.stateEnum = {
            "READY" : 0,
            "FIGHT" : 1,
            "YOU" : 2,
            "COM" : 3,
            "YOU & COM" : 4
        };

        this.mvFightButton = new Button(this.moveFightView, this, "Retry", undefined, 
                                        macchaColor, blackColor, blackColor, undefined, 20);
        this.mvSelectButton = new Button(this.moveSelectView, this, "Select Charactor", undefined, 
                                        macchaColor, blackColor, blackColor, undefined, 20);
        this.mvStartButton = new Button(this.moveStartView, this, "Return to Start", undefined, 
                                        macchaColor, blackColor, blackColor, undefined, 20);
        this.resultButtonList = [this.mvFightButton, this.mvSelectButton, this.mvStartButton];
        
        this.attackPlayerButton = new Button(dummyFunc, this, "X", undefined, r200Color, undefined, undefined, redColor);
        this.dodgePlayerButton = new Button(dummyFunc, this, "Z", undefined, b200Color, undefined, undefined, blueColor);
        this.attackComButton = new Button(dummyFunc, this, "X", undefined, r200Color);
        this.dodgeComButton = new Button(dummyFunc, this, "Z", undefined, b200Color);
        
        this.init();
    }

    init() {
        if(0 <= this.indexSlectedCharList[0] || 0 <= this.indexSlectedCharList[1]) {
            this.charLeft.setIndexImg(this.indexSlectedCharList[0])
            this.charRight.setIndexImg(this.indexSlectedCharList[1])
        }
        this.charLeft.setStability(0);
        this.charRight.setStability(0);
        this.charLeft.setCoolTime(0);
        this.charRight.setCoolTime(0);
        this.charLeft.setAnimeTime(0);
        this.charRight.setAnimeTime(0);
        this.charLeft.setStateFight(stateFightEnum.NEUTRAL);
        this.charRight.setStateFight(stateFightEnum.NEUTRAL);
        this.barLeft.setValue(0);
        this.barRight.setValue(0);
        this.fightTimer = 1000*100;
        this.preAttackTimeList = [this.fightTimer];
        this.preDodgeTimeList = [this.fightTimer];
        this.readyWaitTimer = 1000*1.5;
        this.resultWaitTimer = 0;
        this.state = this.stateEnum.READY;
        for(var resultButton of this.resultButtonList) {
            resultButton.setActiveFlag(false);
        }
        this.indexSelected = 0;
        this.resultButtonList[this.indexSelected].setActiveFlag(true);
    }

    moveFightView() {
        fightView.init();
        drawState = drawStateEnum.FIGHT;
    }

    moveSelectView() {
        selectView.init();
        drawState = drawStateEnum.SELECT;
    }

    moveStartView() {
        startView.init();
        drawState = drawStateEnum.START;
    }

    setIndexSlectedCharList(indexSlectedCharList) {
        this.indexSlectedCharList = indexSlectedCharList;
        this.charLeft.setIndexImg(this.indexSlectedCharList[0])
        this.charRight.setIndexImg(this.indexSlectedCharList[1])
    }

    setBgButtonFunc() {
        this.attackPlayerButton.setFunc(this.attack);
        this.dodgePlayerButton.setFunc(this.dodge);
    }

    resetBgButtonFunc() {
        this.attackPlayerButton.setFunc(dummyFunc);
        this.dodgePlayerButton.setFunc(dummyFunc);
    }

    draw() {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = fontSize28Px+fontMeirio;

        if(this.indexSlectedCharList[0] < 0 || this.indexSlectedCharList[1] < 0) {
            // error
            // show default charctors
        }

        // timer
        this.timerButton.setString(Math.round(this.fightTimer/1000).toString());
        this.timerButton.draw(canvas.width/2-canvas.width/16,
            canvas.height/100,
            canvas.width/8,
            canvas.height/8);

        // stability
        this.drawStability();

        // update
        if(this.state == this.stateEnum.READY) {
            // draw character 
            this.drawCharacter();

            ctx.fillStyle = gray128a05Color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if(this.readyWaitTimer <= 0) {
                this.state = this.stateEnum.FIGHT;
            } else if(this.readyWaitTimer <= 1000*0.5) {
                this.state = this.stateEnum.FIGHT;
            } else {
                ctx.fillStyle = macchaColor;
                ctx.fillRect(
                    canvas.width/2-canvas.width/2, 
                    canvas.height/2-canvas.height/12,
                    canvas.width, 
                    canvas.height/6);
                ctx.fillStyle = blackColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = fontSize28Px+fontMeirio;
                var str = "Ready ?";
                ctx.fillText(str, canvas.width/2, canvas.height/2);

                this.readyWaitTimer -= mSecondDraw;
            }
        } else if(this.state == this.stateEnum.FIGHT) {
            // decrease fight timer
            // why 1.68 ?
            this.fightTimer -= mSecondDraw;//*1.68;

            // player cool time
            if(this.charLeft.getAnimeTime <= 0) {
                this.charLeft.setStateFight(stateFightEnum.NEUTRAL);
                this.charLeft.setNormalImg()
            } else {
                this.charLeft.setAnimeTime(this.charLeft.getAnimeTime-mSecondDraw);
            }
            if(this.charLeft.getCoolTime <= 0) {
            } else {
                this.charLeft.setCoolTime(this.charLeft.getCoolTime-mSecondDraw);
            }

            // com cool time
            if(this.charRight.getAnimeTime <= 0) {
                this.charRight.setStateFight(stateFightEnum.NEUTRAL);
                this.charRight.setNormalImg()
            } else {
                this.charRight.setAnimeTime(this.charRight.getAnimeTime-mSecondDraw);
            }
            if(this.charRight.getCoolTime <= 0) {
                this.calcCom();
            } else {
                this.charRight.setCoolTime(this.charRight.getCoolTime-mSecondDraw);
            }

            // draw character 
            this.drawCharacter();

            // Fight string 
            if(0 < this.readyWaitTimer) {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = fontSize64Px+fontMeirio;
                var str = "Fight !";
                ctx.fillStyle = gray128a05Color;
                ctx.fillText(str, canvas.width/2+3, canvas.height/2+3);
                ctx.fillStyle = macchaColor;
                ctx.fillText(str, canvas.width/2, canvas.height/2);
                var tmpLineWidth = ctx.lineWidth;
                ctx.lineWidth = 1;
                ctx.strokeStyle = blackColor;
                ctx.strokeText(str, canvas.width/2, canvas.height/2);
                
                this.readyWaitTimer -= mSecondDraw;
                ctx.lineWidth = tmpLineWidth;
            }

            // update stability to 0
            this.charLeft.restoreStability();
            this.charRight.restoreStability();

            this.checkResult();
        } else {
            // for finish
            this.drawCharacter();
            this.drawResult();
        }
    }

    drawBackgroundButton() {
        var margin = canvas.width/100;
        this.dodgePlayerButton.draw(
            canvas.width/50+margin, 
            canvas.height/2-canvas.height/4+canvas.height/16, 
            canvas.width/10, 
            canvas.height/8);
        this.attackPlayerButton.draw(
            canvas.width/50+margin+canvas.width/8, 
            canvas.height/2-canvas.height/4+canvas.height/16, 
            canvas.width/10, 
            canvas.height/8);
            
        this.dodgeComButton.draw(
            canvas.width-canvas.width/10-(canvas.width/50+margin), 
            canvas.height/2-canvas.height/4+canvas.height/16, 
            canvas.width/10, 
            canvas.height/8);
        this.attackComButton.draw(
            canvas.width-canvas.width/10-(canvas.width/50+margin+canvas.width/8), 
            canvas.height/2-canvas.height/4+canvas.height/16, 
            canvas.width/10, 
            canvas.height/8);
    }

    drawStability() {
        // stability bar
        this.barLeft.setValue(this.charLeft.getStability);
        this.barLeft.draw(
            canvas.width/2-canvas.width/4-canvas.width/8, 
            canvas.height/50, 
            canvas.width/4, 
            canvas.height/10);
            
        ctx.setTransform(-1, 0, 0, 1, canvas.width/4, 0);
        this.barRight.setValue(this.charRight.getStability);
        this.barRight.draw(
            -(canvas.width/2+canvas.width/4-canvas.width/8), 
            canvas.height/50, 
            canvas.width/4, 
            canvas.height/10);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawCharacter() {
        var margin = 22;
        this.charLeft.draw(
            canvas.width/2-charImgWidth*2+margin, 
            canvas.height/2-charImgHeight, 
            charImgWidth*2, 
            charImgHeight*2);

        ctx.setTransform(-1, 0, 0, 1, charImgWidth*2, 0);
        this.charRight.draw(
            -(canvas.width/2-charImgWidth+charImgWidth-margin), 
            canvas.height/2-charImgHeight, 
            charImgWidth*2,
            charImgHeight*2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    checkResult() {
        if(this.fightTimer <= 0
                || ((this.charLeft.getStability <= this.stabilityMin || this.stabilityMax <= this.charLeft.getStability) 
                    && (this.charRight.getStability <= this.stabilityMin || this.stabilityMax <= this.charRight.getStability))) {
            this.state = this.stateEnum["YOU & COM"];
            this.resultWaitTimer = 0;
        } else if(this.charLeft.getStability <= this.stabilityMin || this.stabilityMax <= this.charLeft.getStability) {
            this.state = this.stateEnum.COM;
            this.resultWaitTimer = 0;
        } else if(this.charRight.getStability <= this.stabilityMin || this.stabilityMax <= this.charRight.getStability) {
            this.state = this.stateEnum.YOU;
            this.resultWaitTimer = 0;
        }
    }

    drawResult() {
        if(this.resultWaitTimer < 100) {
            // waiting
            this.resultWaitTimer += 1;
        } else {
            var str = " WIN !"
            for(var key in this.stateEnum){
                if(this.state == this.stateEnum[key]) {
                    str = key + str;
                    break;
                }
            }
            ctx.fillStyle = macchaColor;
            ctx.fillRect(
                canvas.width/2-canvas.width/2, 
                canvas.height/2-canvas.height/12,
                canvas.width, 
                canvas.height/6);
            ctx.fillStyle = blackColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = fontSize28Px+fontMeirio;
            ctx.fillText(str, canvas.width/2, canvas.height/2);

            var dyButton = canvas.height/6;
            var dy = 10;
            this.mvFightButton.draw(
                canvas.width/2-canvas.width/3/2,
                canvas.height/2-canvas.height/10/2+dyButton,
                canvas.width/3, 
                canvas.height/10);
            dyButton += canvas.height/10+dy;
            this.mvSelectButton.draw(
                canvas.width/2-canvas.width/3/2, 
                canvas.height/2-canvas.height/10/2+dyButton,
                canvas.width/3, 
                canvas.height/10);
            dyButton += canvas.height/10+dy;
            this.mvStartButton.draw(
                canvas.width/2-canvas.width/3/2, 
                canvas.height/2-canvas.height/10/2+dyButton,
                canvas.width/3, 
                canvas.height/10);
        }
    }

    calcCom() {
        this.calcNextTimeList();

        if(this.checkComAttack()) {
            this.calcStability(this.charRight, this.charLeft);

            this.charRight.setStateFight(stateFightEnum.ATTACK);
            this.charRight.setAttackImg();
            this.charRight.setAnimeTime(this.comAnimeTime);
            this.charRight.setCoolTime(this.comCoolTime);
        } else if(this.checkComDodge()) {
            this.charRight.setStateFight(stateFightEnum.DODGE);
            this.charRight.setDodgeImg();
            this.charRight.setAnimeTime(this.comAnimeTime);
            this.charRight.setCoolTime(this.comCoolTime);
        }
    }

    calcNextTimeList() {
        var weight = 1.0
        var coeffSum = 0;
        var indexMax = Math.min(this.maxPreDodgeTime, this.preDodgeTimeList.length);
        var diffDodgeTime = 0;
        for(var indexPreDTime=indexMax-1; 0<indexPreDTime; --indexPreDTime) {
            diffDodgeTime += weight*(this.preDodgeTimeList[indexPreDTime-1]-this.preDodgeTimeList[indexPreDTime]);
            coeffSum += weight;
            weight -= 0.3;
        }
        if(coeffSum!=0) {
            diffDodgeTime = diffDodgeTime/coeffSum;
        }

        this.nextDodgetimeList = [];
        this.nextAttacktimeList = [];
        for(var nextDogdeTime=this.preDodgeTimeList[indexMax-1]-diffDodgeTime; 
            0<nextDogdeTime && 0<diffDodgeTime; 
            nextDogdeTime-=diffDodgeTime) {
            this.nextDodgetimeList.push(nextDogdeTime);
        }

        var weight = 1.0
        var coeffSum = 0;
        var indexMax = Math.min(this.maxPreAttackTime, this.preAttackTimeList.length);
        var diffAttackTime = 0;
        for(var indexPreATime=indexMax-1; 0<indexPreATime; --indexPreATime) {
            diffAttackTime += weight*(this.preAttackTimeList[indexPreATime-1]-this.preAttackTimeList[indexPreATime]);
            coeffSum += weight;
            weight -= 0.2;
        }
        if(coeffSum!=0) {
            diffAttackTime = diffAttackTime/coeffSum;
        }

        for(var nextAttackTime=this.preAttackTimeList[indexMax-1]-diffAttackTime; 
            0<nextAttackTime && 0<diffAttackTime; 
            nextAttackTime-=diffAttackTime) {
            this.nextAttacktimeList.push(nextAttackTime);
            this.nextDodgetimeList.push(nextAttackTime);
        }
    }

    checkComAttack() {
        var ret = false;

        if(this.charLeft.getStability+this.charLeft.getAttackPoint/2 < this.charRight.getStability) {
            ret = true;
        } else if(0 <= this.charRight.getStability && 
            Math.floor(Math.random() * 2 * 1000/mSecondDraw) == 0) {
            ret = true;
        } else if(!ret) {
            for(var nextDogdeTime of this.nextDodgetimeList) {
                if(nextDogdeTime-this.playerCoolTime/2 <= this.fightTimer+mSecondDraw/2 && 
                    this.fightTimer-mSecondDraw/2 < nextDogdeTime+this.playerCoolTime/2) {
                    
                    if(this.charRight.getStability < 0) { 
                        if(Math.floor(Math.random() * 3) == 0) {
                            ret = true;
                            break;
                        }
                    } else {
                        ret = true;
                        break;
                    }
                }
            }
        }

        return ret;
    }

    checkComDodge() {
        var ret = false;

        for(var nextAttackTime of this.nextAttacktimeList) {
            if(nextAttackTime-this.playerCoolTime/2 <= this.fightTimer+mSecondDraw/2 && 
                this.fightTimer-mSecondDraw/2 < nextAttackTime+this.playerCoolTime/2) {
                ret = true;
                break;
            }

            if(this.fightTimer+mSecondDraw/2 < nextAttackTime-this.playerCoolTime/2) {
                break;
            }
        }

        return ret;
    }

    calcStability(charAttack, charPartner) {
        if(charAttack.getStateFight != stateFightEnum.ATTACK) {
            if(charPartner.getStateFight == stateFightEnum.NEUTRAL) {
                charPartner.setStability(charPartner.getStability - charAttack.getAttackPoint);
            } else if(charPartner.getStateFight == stateFightEnum.ATTACK) {
                charAttack.setStability(charAttack.getStability - charPartner.getAttackPoint/2);
                charPartner.setStability(charPartner.getStability - charAttack.getAttackPoint);
            } else if(charPartner.getStateFight == stateFightEnum.DODGE) {
                charAttack.setStability(charAttack.getStability + charAttack.getAttackPoint/3);
            }
        }
    }
    
    attack() {
        this.calcStability(this.charLeft, this.charRight)

        this.charLeft.setStateFight(stateFightEnum.ATTACK);
        this.charLeft.setAttackImg()
        this.charLeft.setAnimeTime(this.playerAnimeTime);
        this.charLeft.setCoolTime(this.playerCoolTime);
        this.keepPushingFlag = true;
        this.preAttackTimeList.push(this.fightTimer);
        if(this.maxPreAttackTime<this.preAttackTimeList.length) {
            this.preAttackTimeList.shift();
        }
    }

    dodge() {
        this.charLeft.setStateFight(stateFightEnum.DODGE);
        this.charLeft.setIndexImg(this.indexSlectedCharList[0])
        this.charLeft.setDodgeImg()
        this.charLeft.setAnimeTime(this.playerAnimeTime);
        this.charLeft.setCoolTime(this.playerCoolTime);
        this.keepPushingFlag = true;
        this.preDodgeTimeList.push(this.fightTimer);
        if(this.maxPreDodgeTime<this.preDodgeTimeList.length) {
            this.preDodgeTimeList.shift();
        }
    }

    getIndexSelected() {
        for(var indexSelected=0; indexSelected<this.resultButtonList.length; ++indexSelected) {
            if(this.resultButtonList[indexSelected].isActiveFlag) {
                break;
            }
        }
        
        if(this.resultButtonList.length <= indexSelected) {
            indexSelected = this.indexSelected;
        }

        return indexSelected;
    }

    keyDownListner(e) {
        if(this.state == this.stateEnum.FIGHT 
            && this.charLeft.getCoolTime <= 0 && !this.keepPushingFlag) {
            // Z or Left
            if(e.keyCode == 90 || e.keyCode == 37) {
                this.dodge();
            }

            // // X or Right
            if(e.keyCode == 88 || e.keyCode == 39) {
                this.attack();
            }
        }
        
        // result
        // waiting
        if(this.state != this.stateEnum.READY 
            && this.state != this.stateEnum.FIGHT 
            && 100 <= this.resultWaitTimer) {
            var indexSelected = this.getIndexSelected();

            // Up
            if(e.keyCode == 38) {
                this.resultButtonList[indexSelected].setActiveFlag(false);
                var indexSelectNext = indexSelected-1<0 ? this.resultButtonList.length-1 : indexSelected-1;
                this.resultButtonList[indexSelectNext].setActiveFlag(true);
                this.indexSelected = indexSelectNext;
            }

            // // Down
            if(e.keyCode == 40) {
                this.resultButtonList[indexSelected].setActiveFlag(false);
                var indexSelectNext = this.resultButtonList.length-1<indexSelected+1 ? 0 : indexSelected+1;
                this.resultButtonList[indexSelectNext].setActiveFlag(true);
                this.indexSelected = indexSelectNext;
            }

            // Z or Space or Enter
            if(e.keyCode == 90 || e.keyCode == 32 || e.keyCode == 13) {
                // call button's function
                this.resultButtonList[indexSelected].getFunc();
            }
        }
    }

    keyUpListener(e) {
        if(this.state == this.stateEnum.FIGHT) {
            // Z or Left
            if(e.keyCode == 90 || e.keyCode == 37) {
                this.keepPushingFlag = false;
            }

            // // X or Right
            if(e.keyCode == 88 || e.keyCode == 39) {
                this.keepPushingFlag = false;
            }
        }
    }

    mouseDownListener(e) {
        if(drawState == drawStateEnum.START) {
            this.resetBgButtonFunc();
            this.attackPlayerButton.mouseDownListener(e);
            this.dodgePlayerButton.mouseDownListener(e);
        } else if(drawState == drawStateEnum.FIGHT) {
            if(this.state == this.stateEnum.FIGHT 
                && this.charLeft.getCoolTime <= 0 && !this.keepPushingFlag) {
                this.setBgButtonFunc();
                this.attackPlayerButton.mouseDownListener(e);
                this.dodgePlayerButton.mouseDownListener(e);
            } else if(this.state == this.stateEnum.FIGHT) {
                this.resetBgButtonFunc();
                this.attackPlayerButton.mouseDownListener(e);
                this.dodgePlayerButton.mouseDownListener(e);
            }
        }
    }

    mouseUpListener(e) {
        if(drawState == drawStateEnum.START) {
            this.attackPlayerButton.mouseUpListener(e);
            this.dodgePlayerButton.mouseUpListener(e);
        } else if(drawState == drawStateEnum.FIGHT) {
            if(this.state == this.stateEnum.FIGHT) {
                this.attackPlayerButton.mouseUpListener(e);
                this.dodgePlayerButton.mouseUpListener(e);
                this.keepPushingFlag = false;
            }
        }
    }

    mouseMoveListener(e) {
        for(var resultButton of this.resultButtonList) {
            resultButton.mouseMoveListener(e);
        }
        this.indexSelected = this.getIndexSelected();
        this.resultButtonList[this.indexSelected].setActiveFlag(true);
    }

    clickListener(e) {
        if(this.state != this.stateEnum.READY 
            && this.state != this.stateEnum.FIGHT 
            && 100 <= this.resultWaitTimer) {
            for(var resultButton of this.resultButtonList) {
                resultButton.clickListener(e);
            }
        }
    }
}