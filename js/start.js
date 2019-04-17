class StartView {
    constructor() {
        var startButton = new Button(
            this.moveNextView,
            this,
            "Start",
            undefined,
            macchaColor,
            undefined,
            blackColor);
        var guideButton = new Button(
            this.openGuide,
            this,
            "Guide",
            undefined,
            macchaColor,
            undefined,
            blackColor);
        var creditButton = new Button(
            this.openCredit,
            this,
            "Credit",
            undefined,
            macchaColor,
            undefined,
            blackColor);
        this.startButtonList = [startButton, guideButton, creditButton];

        this.coverBgButtonList = []
        for(var indexCoverBgButton=0; indexCoverBgButton<4; ++indexCoverBgButton) {
            var coverBgButton = new Button(
                this.closePopup,
                this,
                "",//"debug"+indexCoverBgButton,
                undefined,
                gray128a05Color);
            this.coverBgButtonList.push(coverBgButton);
        }

        this.nahoWikiName = "海老原菜帆のふわっとひととき(海老原菜帆専用wiki)";
        this.linkNahoWikiButton = new Button(
            this.openNahoWiki,
            this,
            this.nahoWikiName,
            undefined,
            macchaColor, 
            undefined, 
            blueColor,
            undefined,
            fontSize12);
            
        this.pixivWikiName = "海老原菜帆とは(ピクシブ百科事典)";
        this.linkPixivWikiButton = new Button(
            this.openPixivWiki,
            this,
            this.pixivWikiName,
            undefined,
            macchaColor, 
            undefined, 
            blueColor,
            undefined,
            fontSize12);
            
        this.myTwitterName = "あおいす";
        this.linkMyTwitterButton = new Button(
            this.openMyTwitter,
            this,
            this.myTwitterName,
            undefined,
            macchaColor, 
            undefined, 
            blueColor,
            undefined,
            fontSize16);

        this.stateEnum = {
            DEFAULT : 0,
            GUIDE : 1,
            CREDIT : 2,
        };

        this.init();
    }

    init() {
        this.indexSelected = 0;
        this.startButtonList[this.indexSelected].setActiveFlag(true);
        this.state = this.stateEnum.DEFAULT;
    }
    
    draw() {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = blackColor;
        ctx.font = fontSize42Px+fontMeirio;
        ctx.fillText(titleStrJa, canvas.width/2, canvas.height/4);
        ctx.font = fontSize28Px+fontMeirio;
        ctx.fillText(titleStrEn, canvas.width/2, canvas.height/3);
        
        var dyButton = 0;
        var dy = 10;
        for(var startButton of this.startButtonList) {
            startButton.draw(
                canvas.width/2-canvas.width/8/2, 
                canvas.height/2-canvas.height/10/2+dyButton, 
                canvas.width/8, 
                canvas.height/10);
            dyButton += canvas.height/10 + dy
        }

        if(this.state != this.stateEnum.DEFAULT) {
            // draw bg gray zone
            this.coverBgButtonList[0].draw(0, 0, canvas.width/10, canvas.height);
            this.coverBgButtonList[1].draw(canvas.width/10, 0, canvas.width-canvas.width/10*2, canvas.height/10);
            this.coverBgButtonList[2].draw(canvas.width-canvas.width/10, 0, canvas.width/10, canvas.height);
            this.coverBgButtonList[3].draw(canvas.width/10, canvas.height-canvas.height/10, canvas.width-canvas.width/10*2, canvas.height/10);
            
            ctx.fillStyle = macchaColor;
            ctx.fillRect(canvas.width/10, 
                canvas.height/10, 
                canvas.width-canvas.width/10*2, 
                canvas.height-canvas.height/10*2);
            if(this.state == this.stateEnum.GUIDE) {
                ctx.fillStyle = white07Color;
                ctx.fillRect(canvas.width/2-canvas.width/2/2, 
                    canvas.height/4-(fontSize42/2+10), 
                    canvas.width/2, 
                    fontSize42+10);
                ctx.fillStyle = blackColor;
                ctx.font = fontSize42Px+fontMeirio;
                ctx.fillText("遊び方", canvas.width/2, canvas.height/4);
                ctx.font = fontSize18Px+fontMeirio;
                var explainStr = "尻相撲マシーンで遊ぼう\n\nZまたは画面のZボタン\n選択 or  回避(尻相撲時)\n\nXまたは画面のXボタン\n戻る or 攻撃(尻相撲時)\n\n相手のゲージを端に追いやるとあなたの勝ちです";
                var diffHeight = fontSize42;
                for(var line of explainStr.split("\n")) {
                    ctx.fillText(line, canvas.width/2, canvas.height/4+diffHeight);
                    diffHeight += fontSize18;
                }
            } else if(this.state == this.stateEnum.CREDIT) {
                ctx.fillStyle = white07Color;
                ctx.fillRect(canvas.width/2-canvas.width/2/2, 
                    canvas.height/4-(fontSize42/2+10), 
                    canvas.width/2, 
                    fontSize42+10);

                ctx.fillStyle = blackColor;
                ctx.font = fontSize42Px+fontMeirio;
                ctx.fillText("クレジット", canvas.width/2, canvas.height/4);
                var explainStr = "担当\n海老原菜帆\nlinkNahoWiki\nlinkPixivWiki\n\n作者\nlinkMyTwitter";
                var diffHeight = fontSize42;
                for(var line of explainStr.split("\n")) {
                    if(line == "linkNahoWiki") {
                        this.drawLink(this.linkNahoWikiButton, this.nahoWikiName, fontSize12, diffHeight);
                    } else if(line == "linkPixivWiki") {
                        this.drawLink(this.linkPixivWikiButton, this.pixivWikiName, fontSize12, diffHeight);
                    } else if(line == "linkMyTwitter") {
                        this.drawLink(this.linkMyTwitterButton, this.myTwitterName, fontSize16, diffHeight);
                    } else {
                        if(line == "海老原菜帆") {
                            ctx.font = fontSize16Px+fontMeirio;
                        } else {
                            ctx.font = fontSize18Px+fontMeirio;
                        }
                        ctx.fillStyle = blackColor;
                        ctx.fillText(line, canvas.width/2, canvas.height/4+diffHeight);
                    }
                    diffHeight += fontSize18+fontSize18/8;
                }
            }
        }
    }

    drawLink(linkButton, linkName, fontSize, diffHeight) {
        var linkNameLen = getLength(linkName);

        linkButton.draw(
            canvas.width/2-(fontSize/2*linkNameLen)/2, 
            canvas.height/4+diffHeight-fontSize/2,
            fontSize/2*linkNameLen,
            fontSize);

        var tmpLineWidth = ctx.lineWidth;
        ctx.lineWidth = 1;
        ctx.strokeStyle = blueColor;
        ctx.beginPath();
        ctx.moveTo(canvas.width/2-(fontSize/2*linkNameLen)/2, canvas.height/4+diffHeight-fontSize/2+fontSize);
        ctx.lineTo(canvas.width/2+(fontSize/2*linkNameLen)/2, canvas.height/4+diffHeight-fontSize/2+fontSize);
        ctx.stroke();
        ctx.lineWidth = tmpLineWidth;
    }

    moveNextView() {
        selectView.init();
        drawState = drawStateEnum.SELECT;
    }

    openGuide() {
        this.state = this.stateEnum.GUIDE;
    }

    openCredit() {
        this.state = this.stateEnum.CREDIT;
    }

    closePopup() {
        this.state = this.stateEnum.DEFAULT;
    }

    openNahoWiki() {
        window.open("https://seesaawiki.jp/ebihara_naho/", "_blank");
    }

    openPixivWiki() {
        window.open("https://dic.pixiv.net/a/海老原菜帆", "_blank");
    }

    openMyTwitter() {
        window.open("https://twitter.com/eochair_aoisu", "_blank");
    }

    getIndexSelected() {
        for(var indexSelect=0; indexSelect<this.startButtonList.length; ++indexSelect) {
            if(this.startButtonList[indexSelect].isActiveFlag) {
                break;
            }
        }
        
        if(this.startButtonList.length <= indexSelect) {
            indexSelect = this.indexSelected;
        }

        return indexSelect;
    }

    keyDownListner(e) {
        if(this.state==this.stateEnum.DEFAULT) {
            var indexSelected = this.getIndexSelected();

            // Up
            if(e.keyCode == 38) {
                this.startButtonList[indexSelected].setActiveFlag(false);
                // var indexSelectNext = indexSelected - 1;
                // if(indexSelectNext < 0) {
                //     indexSelectNext = this.startButtonList.length-1;
                // }
                var indexSelectNext = indexSelected-1<0 ? this.startButtonList.length-1 : indexSelected-1;
                this.startButtonList[indexSelectNext].setActiveFlag(true);
                this.indexSelected = indexSelectNext;
            }

            // // Down
            if(e.keyCode == 40) {
                this.startButtonList[indexSelected].setActiveFlag(false);
                // var indexSelectNext = indexSelected + 1;
                // if(this.startButtonList.length <= indexSelectNext) {
                //     indexSelectNext = 0;
                // }
                var indexSelectNext = this.startButtonList.length-1<indexSelected+1 ? 0 : indexSelected+1;
                this.startButtonList[indexSelectNext].setActiveFlag(true);
                this.indexSelected = indexSelectNext;
            }

            // Z or Space or Enter
            if(e.keyCode == 90 || e.keyCode == 32 || e.keyCode == 13) {
                if(indexSelected == 0) {
                    this.moveNextView();
                } else if(indexSelected == 1) {
                    this.openGuide();
                } else if(indexSelected == 2) {
                    this.openCredit();
                }
            }
        } else {
            // X or C or ESC
            if(e.keyCode == 88 || e.keyCode == 67 || e.keyCode == 27) {
                this.state = this.stateEnum.DEFAULT;
            }
        }
    }

    mouseUpListener(e) {
        if(this.state==this.stateEnum.CREDIT) {
            this.linkNahoWikiButton.mouseUpListenerWithFunc(e);
            this.linkPixivWikiButton.mouseUpListenerWithFunc(e);
            this.linkMyTwitterButton.mouseUpListenerWithFunc(e);
        }
    }

    mouseMoveListener(e) {
        for(var startButton of this.startButtonList) {
            startButton.mouseMoveListener(e);
        }
        this.indexSelected = this.getIndexSelected();
        this.startButtonList[this.indexSelected].setActiveFlag(true);
    }

    clickListener(e) {
        if(this.state==this.stateEnum.DEFAULT) {
            for(var startButton of this.startButtonList) {
                startButton.clickListener(e);
            }
        } else {
            for(var coverBgButton of this.coverBgButtonList) {
                coverBgButton.clickListener(e);
            }
        }
    }
}
