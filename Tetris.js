import Shape from "./Shape.js";
import Cell from "./Cell.js";
import Commons from "./Commons.js";

export default function Tetris(rowNo, colNo){
    let contours = ['Z','L','O','I','T','Z','J'];
    let table = [];
    let score = 0;
    document.getElementById('score').textContent = score;
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

    this.bottomIsReached = function(x){
        return (x+1)==table.length;
    }

    this.shapeTouched = function(shape, table){
        let matrix = shape.matrix;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const val = matrix[i][j];
                if (val){
                    let cnvsRowBeneathNdx = shape.x - matrix.length + i + 2;
                    let cnvsColBeneathNdx = shape.y +j;
                    if (cnvsRowBeneathNdx > -1 && table[cnvsRowBeneathNdx][cnvsColBeneathNdx].state)
                        return true;
                }
            }
        }
        return false;
    }

    function pinShapeToTable(shape, table){
        for (let i = 0; i < shape.matrix.length; i++) {
            for (let j = 0; j < shape.matrix[i].length; j++) { 
                if (shape.matrix[i][j]){
                    let tblCoords = shape.getCellTableCoords(i,j);
                    table[tblCoords.x][tblCoords.y].setState(shape.matrix[i][j]).setColor(tblCoords.x, tblCoords.y, shape.matrix[i][j], );
                }
            }
        }
        table = handleFullLines(table);
        return table;
    }

    function restructureTable(table){
        
        let count = table.length;
        let fullLines = [];
        let cntFullLines = 0;
        let ndxFullLines = []

        while(count--){
            // if (table[count].every(cell=>cell.state) && table[count-1]?.some(cell=>cell.state)){
            if (table[count].every(cell=>cell.state)){
                table.splice(count, 1);
                cntFullLines++;
                ndxFullLines.push(count);
            }
            else{
                if (cntFullLines) fullLines.push(cntFullLines);
                cntFullLines = 0;
            }
        }
        return [fullLines, table];
    }

    function getScore(fullLines){
        return fullLines.reduce((acc,cur)=>{
            return acc + {
                1:40,
                2:100,
                3:300,
                4:1200,
            }[cur];
        },0);
    }

    function redraw(origTbl, newTbl){
        for (let i = 0; i < origTbl.length; i++) {
            const origRow = origTbl[i];
            const newRow = newTbl[i];
            for (let j = 0; j < origRow.length; j++) {
                const origCell = origRow[j];
                const newCell = newRow[j];
                if (origCell.state !== newCell.state)
                    Commons.paintCellHtmlElement(i,j, newCell.state);
            }
        }
    }

    function handleFullLines(table){
        let startingTable = structuredClone(table);
        let fullLines;
        [fullLines, table] = restructureTable(table);
        score += getScore(fullLines);
        
        document.getElementById('score').textContent = score;

        let totalDeletedRows = fullLines.reduce((acc,cur) => acc+cur, 0);

        for (let i = 0; i < totalDeletedRows; i++) {
            let tRow = [];
            for (let j = 0; j < colNo; j++) 
                tRow.push(new Cell(0, null, i, j));
            table.unshift(tRow);
        }

        if (fullLines.length)
            redraw(startingTable, table);

        return table;
    }

    function getRandomShape (){
        // return new Shape('Z');
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

    this.drawBoard = function(){
        if (window.hasBoard){return;}
        let container = document.getElementById('tet-cont');
        const HTML_ELEMENT = 'div';
        const template = document.querySelector('#cellContent');
        
        table.forEach( (row, rowNdx)=>{
            const rowDiv = document.createElement(HTML_ELEMENT);
            rowDiv.setAttribute('id', `r${rowNdx}`);
            rowDiv.setAttribute('class', 'row');
            container.appendChild(rowDiv);
            row.forEach(( _ , colNdx) =>{
                const cellDiv = document.createElement(HTML_ELEMENT);
                const clone = template.content.cloneNode(true);
                cellDiv.setAttribute('id', `r${rowNdx}c${colNdx}`);
                cellDiv.appendChild(clone);
                rowDiv.appendChild(cellDiv);
            });
        });
        window.hasBoard = true;

    }

    this.tick = function(){
        let shape = getRandomShape();
        window._shape = shape;
        const shapeReleaser = () => {
            shape.draw(table);
            if (this.bottomIsReached(shape.x) || this.shapeTouched(shape, table)){
                 //we give player 0.5 sec so he can rotate in place
                 table = pinShapeToTable(shape, table);
                 shape = getRandomShape();
                 setTimeout(shapeReleaser, 1000);
            }
            else
                shape.x++;
        }
        
        let intervalId = setInterval(shapeReleaser, 500);
        return intervalId;
    }
}