
// let TABLE_CANVAS_DEFAULT_COLOR = '#d7d7fc';
let TABLE_CANVAS_DEFAULT_COLOR = '#f1f1ff';

function paintCellHtmlElement(rowNdx, colNdx, cellVal, color){
    let elm = document.getElementById(`r${rowNdx}c${colNdx}`);
    elm.style.backgroundColor = (cellVal ?  color : TABLE_CANVAS_DEFAULT_COLOR);
}

function Shape(contour){
    //each countour has matrix
    let contours = {
        'L' : {
            'matrix' : [
                [1,0],
                [1,0],
                [1,1],
            ],
            'color' : "#9b5fe0",
        },
        'J' : {
            'matrix' : [
                [0,1],
                [0,1],
                [1,1],
            ],
            'color': "#16a4d8",
        },
        'T' : {
            'matrix' : [
                [0,1,0],
                [1,1,1],
            ],
            'color':"#60dbe8",
        },
        'S' : {
            'matrix' : [
                [0,1,1],
                [1,1,0],
            ],
            'color' : "#8bd346",
        },
        'Z' : {
            'matrix' : [
                [1,1,0],
                [0,1,1],
            ],
            'color' : "#efdf48",
        },
        'O' : {
            'matrix' : [
                [1,1],
                [1,1],
            ],
            'color' : "#f9a52c",
        },
        'I' : {
            'matrix' : [
                [1],
                [1],
                [1],
                [1],
            ],
            'color' : "#d64e12"
        },
        
    }
    let color = null;
    let curPos = [0,0];
    let dirty = [];
    this.getCurPos = function(){
        return curPos;
    }
    this.setCurPos = function(newVal){
        curPos = newVal;
    }
    this.getColor = function(){
        return contours[contour].color;
    }
    this.getContour = function(){
        return contour;
    }
    this.getMatrixHeight = function(){
        /* need this func so that we know above which row is it safe to clear trail*/
        return contours[contour].matrix.length;
    }
    this.getMatrixWidth = function(){
        return contours[contour].matrix[0].length;
    }
    this.getMatrix = function(){
        //we can draw each elem on matrix, easier to reason about
        return contours[contour].matrix;
    }
    this.draw = function(table){
        /*
            draw on screen. called after any action and timerInterval
            we are drawing rows from our matrix on "canvas" 
            drawing direction is bottom to up
            we draw while we have rows to draw on canvas and 
                while we have rows in matrix to draw
            
        */

        //first clear previous draw
        for (let coordPair of dirty){
            if (!table[coordPair[0]][coordPair[1]].getState()){
                const elm = document.getElementById(`r${coordPair[0]}c${coordPair[1]}`)
                elm.style.backgroundColor = TABLE_CANVAS_DEFAULT_COLOR;
            }
        }

        dirty = [];

        let pos = this.getCurPos();
        let matrix = contours[contour].matrix;
        let cnvsRowsToDrawNdx = pos[0];
        let mtrxRowNdxForDrawing = matrix.length-1;
        while (cnvsRowsToDrawNdx > -1 && mtrxRowNdxForDrawing > -1){
            let mtrxRow = matrix[mtrxRowNdxForDrawing];
            mtrxRow.forEach((cellVal, cellNdx)=>{
                let translatedCellNdx = cellNdx + pos[1];
                // let elm = document.getElementById(`r${cnvsRowsToDrawNdx}c${translatedCellNdx}`);
                // let color =  (cellVal ? this.getColor() : TABLE_CANVAS_DEFAULT_COLOR);
                // elm.style.backgroundColor = color;
                if (table[cnvsRowsToDrawNdx][translatedCellNdx].getState())
                    return;
                paintCellHtmlElement(cnvsRowsToDrawNdx,translatedCellNdx,cellVal,this.getColor());
                dirty.push([cnvsRowsToDrawNdx,translatedCellNdx]);
            });
            cnvsRowsToDrawNdx--;
            mtrxRowNdxForDrawing--;
        }
    }

    this.rotate = function(){
        //rotate clockwise  kbd up
    }
    this.throw = function(){
        //throw shape straight at bottom, kbd down
    }
    window._shape = this;
}

function Cell (state=0,color=null,row,col){

    this.getColor = function(){
        return color;
    }
    this.setColor = function(newColor){
        paintCellHtmlElement(row,col,this.getState(),newColor);
        color = newColor;
        return this;
    }
    this.getState = function (){
        return state;
    }
    this.setState = function (newState){
        state = newState;
        return this;
    }
}

function Tetris(rowNo, colNo){
    // let contours = ['L','T','Z'];
    let contours = ['Z','L','O','I','T','Z','J'];
    //state of table, we mark with 1 if brick shape is bound to the cell
    let table = [];
    window._table = table;
    window._rowNo = rowNo;
    window._colNo = colNo;
    for (let i = 0; i < rowNo; i++) {
        let rowArr = [];
        for (let j = 0; j < colNo; j++) {
            rowArr.push(new Cell(0,null,i,j));
        }
        table.push(rowArr);
    }
    //stack of shapes, so we can check if some shape didn't appear randomly in last ...10 
    let stackOfShapes = [];

    function bottomIsReached(shapeCoords){
        return (shapeCoords[0]+1)==table.length;
    }

    function shapeTouched(shape, table){
        let matrix = shape.getMatrix();
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const val = matrix[i][j];
                if (val){
                    cnvsRowBeneathNdx = shape.getCurPos()[0] - matrix.length + i + 2;
                    if (cnvsRowBeneathNdx > -1 && table[cnvsRowBeneathNdx][j].getState())
                        return true;
                }
            }
        }
        return false;
    }

    function pinShapeToTable(shape, table){
        let coords = shape.getCurPos();
        let matrix = shape.getMatrix();
        let color = shape.getColor();
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) { 
                const element = matrix[i][j];
                let translatedTableRow = coords[0] - ((matrix.length-1) - i);
                let translatedTableCol = coords[1] + j;
                if (element)
                   table[translatedTableRow][translatedTableCol].setState(element).setColor(color);
            }
        }
        return table;
    }
    

    this.drawBoard = function(){
        if (window.hasBoard){return;}
        let container = document.getElementById('tet-cont');
        const HTML_ELEMENT = 'div';
        table.forEach( (row, rowNdx)=>{
            const rowDiv = document.createElement(HTML_ELEMENT);
            rowDiv.setAttribute('id', `r${rowNdx}`);
            rowDiv.setAttribute('class', 'row');
            container.appendChild(rowDiv);
            row.forEach(( _ , colNdx) =>{
                const cellDiv = document.createElement(HTML_ELEMENT);
                cellDiv.setAttribute('id', `r${rowNdx}c${colNdx}`);
                cellDiv.setAttribute('class', 'cell');
                cellDiv.style.backgroundColor = TABLE_CANVAS_DEFAULT_COLOR;
                rowDiv.appendChild(cellDiv);
            });
        });
        window.hasBoard = true;

    }

    function* shapeGenerator(){
        yield 'L'
        yield 'Z'
    }
    let g = shapeGenerator();

    this.getRandomShape = function(){
        let debug = 'T';
        if (debug)
            return new Shape(debug);
        let hasTen = (stackOfShapes.length >= 10);
        if (hasTen){
            for (let contour of contours){
                if (stackOfShapes.indexOf(contour) < 0){
                    stackOfShapes.shift();
                    stackOfShapes.push(contour);
                    console.log(`pseudo random: ${contour}`);
                    return new Shape(contour);
                }
            }
        }
        const rndContour = contours[Math.floor(Math.random() * contours.length)];
        stackOfShapes.push(rndContour);
        return new Shape(rndContour);
    }
    this.tick = function(){
        let shape = this.getRandomShape();
        window._shape = shape;
        const shapeReleaser = () => {
            shape.draw(table);
            // this.clearTrail(shape.getMatrixHeight());
            if (bottomIsReached(shape.getCurPos()) || shapeTouched(shape, table)){
                 //we give player 0.5 sec so he can rotate in place
                 table = pinShapeToTable(shape, table);
                 shape = this.getRandomShape();
                 setTimeout(shapeReleaser, 1000);
            }
            else
                shape.setCurPos([shape.getCurPos()[0]+1, shape.getCurPos()[1]]);
        }
        
        let intervalId = setInterval(shapeReleaser, 200);
        return intervalId;
    }



}

window.addEventListener('DOMContentLoaded', (event) => {
    let intervalId;
    let btnStart = document.getElementById('start');
    let btnStop = document.getElementById('stop');
    btnStart.onmouseup = () =>{
        const T = new Tetris(20,10);
        T.drawBoard();
        intervalId = T.tick();
    }
    btnStop.onmouseup = () =>{
        clearInterval(intervalId)
    }
});

window.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    let shape = window._shape;
    let table = window._table;
    switch (event.key) {
        case 'ArrowRight':
            if ((shape.getCurPos()[1] + shape.getMatrixWidth()) == window._colNo)
                break;
            shape.setCurPos([shape.getCurPos()[0], shape.getCurPos()[1]+1]);
            shape.draw(table);
            
    
        default:
            break;
    }
    console.log('ada')
});

