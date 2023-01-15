import Commons from "./Commons.js";

export default class Shape {

    x;                   
    y;
    dirty = [];
    color;
    contour;
    matrix;
    matrixHeight;
    matrixWidth;
    rotIndex;

    constructor(contour){
        this.x = 0;
        this.y = 0;
        this.dirty = [];
        this.color = Commons.contours[contour].color;
        this.contour = contour;
        this.matrix = Commons.contours[contour].matrix;
        this.matrixHeight = this.matrix.length;
        this.matrixWidth = this.matrix[0].length;
        this.rotations = Commons.contours[contour].rotations;
        this.rotIndex = -1;
        window._shape = this;
    }

    getCellTableCoords(i,j){
        return {
            x: this.x - ((this.matrix.length-1) - i),
            y: this.y + j,
        }
    }

    draw(table){
        /*
            draw on screen. called after any action and timerInterval
            we are drawing rows from our matrix on "canvas" 
            drawing direction is bottom to up
            we draw while we have rows to draw on canvas and 
                while we have rows in matrix to draw
        */
        //first clear previous draw
        for (let coordPair of this.dirty){
            if (!table[coordPair[0]][coordPair[1]].state){
                const elm = document.getElementById(`r${coordPair[0]}c${coordPair[1]}`)
                let elm1 = elm.children[0].children[0];
                let elm2 = elm.children[0].children[0].children[0]
                elm1.style.backgroundColor = Commons.TABLE_CANVAS_DARKER_COLOR;
                elm2.style.backgroundColor = Commons.TABLE_CANVAS_DARKER_COLOR;
            }
        }

        this.dirty = [];

        let cnvsRowsToDrawNdx = this.x;
        let mtrxRowNdxForDrawing = this.matrix.length-1;
        while (cnvsRowsToDrawNdx > -1 && mtrxRowNdxForDrawing > -1){
            let mtrxRow = this.matrix[mtrxRowNdxForDrawing];
            mtrxRow.forEach((cellVal, cellNdx)=>{
                let translatedCellNdx = cellNdx + this.y;
                if (table[cnvsRowsToDrawNdx][translatedCellNdx].state)
                    return;
                Commons.paintCellHtmlElement(cnvsRowsToDrawNdx, translatedCellNdx, cellVal, this.color);
                this.dirty.push([cnvsRowsToDrawNdx, translatedCellNdx]);
            });
            cnvsRowsToDrawNdx--;
            mtrxRowNdxForDrawing--;
        }
    }

    canMoveRightLeft(table, delta){
        //for right delta=1, for left delta = -1
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) { 
                if (this.matrix[i][j]){
                    let tblCoords = this.getCellTableCoords(i,j);
                    if (table[tblCoords.x][tblCoords.y+delta].state)
                        return false;
                }
            }
        }
        return true;
    }

    rotationGenerator(){
        let rotIndex = this.rotIndex + 1;
        return this.rotations[(rotIndex % this.rotations.length)];
    }


    canRotate(table){
        let tempMatrix = this.rotationGenerator().matrix;
        for (let i = 0; i < tempMatrix.length; i++) {
            for (let j = 0; j < tempMatrix[i].length; j++) { 
                if (tempMatrix[i][j]){
                    let tblCoords = this.getCellTableCoords(i,j);
                    if (table[tblCoords.x][tblCoords.y].state)
                        return false;
                }
            }
        }
        return true;
    }

    doRotate(){
        this.matrix = this.rotationGenerator().matrix;
        this.matrixHeight = this.matrix.length;
        this.matrixWidth = this.matrix[0].length;
        this.rotIndex++;
    }

}