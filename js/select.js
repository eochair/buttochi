class SelectView {
    constructor() {
        this.charButtonList = [];

        this.playerSelectStateEnum = {
            PLAYER1 : 0,
            PLAYER2 : 1,
            READY : 2
        };
        this.playerColor = [redColor, blueColor, clearColor];

        this.margin = 10;

        // char_button
        for(var indexY=0; indexY<charRow; ++indexY) {
            for(var indexX=0; indexX<charCol; ++indexX) {
                this.img = new Image();
                var indexImg = (indexY*(charRow+1)+indexX)
                this.img.src = charList[indexImg].srcNormal;

                var charButton = new Button(
                    this.selectCharacter,
                    this,
                    "char"+indexImg,
                    this.img);

                this.charButtonList.push(charButton);
            }
        }

        // character space
        this.playerSpaceButton = new Button(
            this.unselectPlayerCharacter, 
            this,
            "",
            undefined,
            this.playerColor[0]);

        this.comSpaceButton = new Button(
            this.unselectComCharacter, 
            this,
            "",
            undefined,
            this.playerColor[1]);


        // selected character
        this.restWidth = canvas.width - charImgWidth*(charCol) - this.margin*(charCol-1);
        this.charLeftImg = new Image();
        this.charRightImg = new Image();

        // ready button after selecting character
        this.readyButton = new Button(
            this.moveNextView, 
            this,
            "Ready ?",
            undefined,
            macchaColor,
            undefined,
            blackColor,
            undefined,
            28);

        // bg for cancel ready
        this.cancelReadyTopButton = new Button(
            this.unselectComCharacter, 
            this,
            "",//"debugTop",
            undefined,
            clearColor);
        
        this.cancelReadyBottomButton = new Button(
            this.unselectComCharacter, 
            this,
            "",//"debugBottom",
            undefined,
            clearColor);

        this.init();
    }

    init() {
        this.playerSelectState = this.playerSelectStateEnum.PLAYER1;
        this.indexSelectedCharList = [-1, -1];
        this.resetSelectedFlag();
        this.charButtonList[0].setActiveFlag(true);
        this.indexSelected = 0;
    }

    draw() {
        // space for player 1
        // ctx.fillRect(this.restWidth/4-charImgWidth, canvas.height/2-charImgHeight, charImgWidth*2, charImgHeight*2);
        this.playerSpaceButton.draw(
            this.restWidth/4-charImgWidth, 
            canvas.height/2-charImgHeight, 
            charImgWidth*2, 
            charImgHeight*2);
        ctx.fillStyle = this.playerColor[0];
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = fontSize28Px+fontMeirio;
        ctx.fillText("YOU", this.restWidth/4, canvas.height/2-charImgHeight);
        
        // space for player 2
        // ctx.fillRect((canvas.width-this.restWidth/4)-charImgWidth, canvas.height/2-charImgHeight, charImgWidth*2, charImgHeight*2);
        this.comSpaceButton.draw(
            (canvas.width-this.restWidth/4)-charImgWidth, 
            canvas.height/2-charImgHeight, 
            charImgWidth*2, 
            charImgHeight*2)
        ctx.fillStyle = this.playerColor[1];
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = fontSize28Px+fontMeirio;
        ctx.fillText("COM", canvas.width-this.restWidth/4, canvas.height/2-charImgHeight);

        var coefHeight = charRow%2==0 ? 0 : -1; 
        var coefWidth = charCol%2==0 ? 0 : -1; 
        // draw character
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        for(var indexY=0; indexY<charRow; ++indexY) {
            for(var indexX=0; indexX<charCol; ++indexX) {
                this.charButtonList[indexY*(charRow+1)+indexX].setButtonSelectColor(this.playerColor[this.playerSelectState]);
                this.charButtonList[indexY*(charRow+1)+indexX]
                .draw(
                    canvas.width/2+coefWidth*charImgWidth/2+(indexX-1)*(charImgWidth+this.margin), 
                    canvas.height/2+coefHeight*charImgHeight/2+(indexY-1)*(charImgHeight+this.margin), 
                    charImgWidth, 
                    charImgHeight);
            }
        }

        // set selected character img
        if(this.playerSelectState == this.playerSelectStateEnum.PLAYER1) {
            var indexSelect = this.getIndexSelected();
            this.charLeftImg.src = charList[indexSelect].srcNormal;
        } else if(this.playerSelectState == this.playerSelectStateEnum.PLAYER2) {
            this.charLeftImg.src = charList[this.indexSelectedCharList[0]].srcNormal;
            var indexSelect = this.getIndexSelected();
            this.charRightImg.src = charList[indexSelect].srcNormal;
        } else if(this.playerSelectState == this.playerSelectStateEnum.READY) {
            this.charLeft
            this.charLeftImg.src = charList[this.indexSelectedCharList[0]].srcNormal;
            this.charRightImg.src = charList[this.indexSelectedCharList[1]].srcNormal;
        } else {
            // error
        }

        // draw left character
        ctx.setTransform(-1, 0, 0, 1, charImgWidth*2, 0);
        ctx.drawImage(this.charLeftImg, 
            -(this.restWidth/4-charImgWidth), 
            canvas.height/2-charImgHeight, 
            charImgWidth*2, 
            charImgHeight*2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // draw right character
        if(this.playerSelectState != this.playerSelectStateEnum.PLAYER1) {
            ctx.drawImage(this.charRightImg, 
                (canvas.width-this.restWidth/4)-charImgWidth, 
                canvas.height/2-charImgHeight, 
                charImgWidth*2, 
                charImgHeight*2);
        }

        // draw ready str
        if(this.playerSelectState == this.playerSelectStateEnum.READY) {
            this.cancelReadyTopButton.draw(0, 0, canvas.width, canvas.height/2-canvas.height/12);
            this.cancelReadyBottomButton.draw(0, canvas.height/2+canvas.height/12, canvas.width, canvas.height/2-canvas.height/12);
            this.readyButton.draw(
                canvas.width/2-canvas.width/2, 
                canvas.height/2-canvas.height/12,
                canvas.width, 
                canvas.height/6);
                
        }
    }

    getIndexSelected() {
        for(var indexSelected=0; indexSelected<charRow*charCol; ++indexSelected) {
            if(this.charButtonList[indexSelected].isActiveFlag) {
                break;
            }
        }
        
        if(charRow*charCol <= indexSelected) {
            indexSelected = this.indexSelected;
        }

        return indexSelected;
    }

    resetSelectedFlag() {
        for(var charButton of this.charButtonList) {
            charButton.setActiveFlag(false);
        }
    }

    moveNextView() {
        fightView.init();
        fightView.setIndexSlectedCharList(this.indexSelectedCharList);
        drawState = drawStateEnum.FIGHT;
    }

    selectCharacter(indexSelected) {
        if(this.playerSelectState == this.playerSelectStateEnum.PLAYER1) {
            this.indexSelectedCharList[this.playerSelectStateEnum.PLAYER1] = indexSelected;

            this.playerSelectState = this.playerSelectStateEnum.PLAYER2
            this.resetSelectedFlag();
            this.charButtonList[0].setActiveFlag(true);
            this.indexSelected = 0;
        } else if(this.playerSelectState == this.playerSelectStateEnum.PLAYER2) {
            this.indexSelectedCharList[this.playerSelectStateEnum.PLAYER2] = indexSelected;

            this.playerSelectState = this.playerSelectStateEnum.READY
            this.resetSelectedFlag();
        } else if(this.playerSelectState == this.playerSelectStateEnum.READY) {
            this.moveNextView();
        } else {
            // error
        }
    }

    unselectPlayerCharacter() {
        if(this.playerSelectState != this.playerSelectStateEnum.PLAYER1) {
            this.playerSelectState = this.playerSelectStateEnum.PLAYER1;
            this.resetSelectedFlag();
            if(0 <= this.indexSelectedCharList[0]) {
                this.charButtonList[this.indexSelectedCharList[0]].setActiveFlag(true);
                this.indexSelected = this.indexSelectedCharList[0];
                this.indexSelectedCharList[0] = -1;
            } else {
                this.charButtonList[0].setActiveFlag(true);
                this.indexSelected = 0;
            }
        }
    }

    unselectComCharacter() {
        if(this.playerSelectState != this.playerSelectStateEnum.PLAYER1 
            && this.playerSelectState != this.playerSelectStateEnum.PLAYER2) {
            this.playerSelectState = this.playerSelectStateEnum.PLAYER2;
            this.resetSelectedFlag();
            if(0 <= this.indexSelectedCharList[1]) {
                this.charButtonList[this.indexSelectedCharList[1]].setActiveFlag(true);
                this.indexSelected = this.indexSelectedCharList[1];
                this.indexSelectedCharList[1] = -1;
            } else {
                this.charButtonList[0].setActiveFlag(true);
                this.indexSelected = 0;
            }
        }
    }

    keyDownListner(e) {
        var indexSelected = this.getIndexSelected();

        // Up
        if(e.keyCode == 38 && this.playerSelectState != this.playerSelectStateEnum.READY) {
            this.charButtonList[indexSelected].setActiveFlag(false);
            var indexSelectNext = indexSelected - charCol;
            if(indexSelectNext < 0) {
                indexSelectNext = (charRow-1)*charCol+(indexSelected%charCol);
            }
            this.charButtonList[indexSelectNext].setActiveFlag(true);
            this.indexSelected = indexSelectNext;
        }

        // Down
        if(e.keyCode == 40 && this.playerSelectState != this.playerSelectStateEnum.READY) {
            this.charButtonList[indexSelected].setActiveFlag(false);
            var indexSelectNext = indexSelected + charCol;
            if(charRow*charCol <= indexSelectNext) {
                indexSelectNext = indexSelected%charCol;
            }
            this.charButtonList[indexSelectNext].setActiveFlag(true);
            this.indexSelected = indexSelectNext;
        }

        // left
        if(e.keyCode == 37 && this.playerSelectState != this.playerSelectStateEnum.READY) {
            this.charButtonList[indexSelected].setActiveFlag(false);
            var indexSelectNext = indexSelected - 1;
            if(indexSelectNext < charCol*Math.floor(indexSelected/charCol)) {
                indexSelectNext = charCol*(Math.floor(indexSelected/charCol)+1)-1;
            }
            this.charButtonList[indexSelectNext].setActiveFlag(true);
            this.indexSelected = indexSelectNext;
        }

        // right
        if(e.keyCode == 39 && this.playerSelectState != this.playerSelectStateEnum.READY) {
            this.charButtonList[indexSelected].setActiveFlag(false);
            var indexSelectNext = indexSelected + 1;
            if(charCol*(Math.floor(indexSelected/charCol)+1)-1 < indexSelectNext) {
                indexSelectNext = charCol*Math.floor(indexSelected/charCol);
            }
            this.charButtonList[indexSelectNext].setActiveFlag(true);
            this.indexSelected = indexSelectNext;
        }

        // Z or Space or Enter
        if(e.keyCode == 90 || e.keyCode == 32 || e.keyCode == 13) {
            this.selectCharacter(indexSelected);
        }

        // X or C
        if(e.keyCode == 88 || e.keyCode == 67) {
            if(this.playerSelectState == this.playerSelectStateEnum.PLAYER1) {
                // Nop;
            } else if(this.playerSelectState == this.playerSelectStateEnum.PLAYER2) {
                this.unselectPlayerCharacter();
            } else if(this.playerSelectState == this.playerSelectStateEnum.READY) {
                this.unselectComCharacter();
            } else {
                // error
            }
        }
    }

    mouseMoveListener(e) {
        for(var charButton of this.charButtonList) {
            charButton.mouseMoveListener(e);
        }
        this.indexSelected = this.getIndexSelected();
        this.charButtonList[this.indexSelected].setActiveFlag(true);
    }

    clickListener(e) {
        if(this.playerSelectState != this.playerSelectStateEnum.READY) {
            this.playerSpaceButton.clickListener(e);
            this.comSpaceButton.clickListener(e);
            for(var indexY=0; indexY<charRow; ++indexY) {
                for(var indexX=0; indexX<charCol; ++indexX) {
                    var indexSelected = indexY*(charRow+1)+indexX;
                    this.charButtonList[indexSelected].clickListener(e, indexSelected);
                }
            }
        } else {
            this.readyButton.clickListener(e);
            this.cancelReadyTopButton.clickListener(e);
            this.cancelReadyBottomButton.clickListener(e);
        }
    }
}