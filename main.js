


function Shape(contour){
    //each countour has matrix

    

    let contours = {
        'L' : {
            'matrix' : [
                [0,0,1,0],
                [0,0,1,0],
                [0,0,1,1],
                [0,0,0,0],
            ]
        }
    }

    this.matrix = function(){
        //we can draw each elem on matrix, easier to reason about
    }
    
    this.getCenter = function(){
        //each shape must have center arround which one we rotate
        //
    }

    this.draw = function(pos){
        /*
            draw on screen. called after any action and timerInterval
            we are drawing rows from our matrix on "canvas" 
            drawing direction is bottom to up
            we draw while we have rows to draw on canvas and 
                while we have rows in matrix to draw
            
        */
        let matrix = contours[contour].matrix;
        let cnvsRowsToDrawNdx = pos[0];
        let mtrxRowNdxForDrawing = matrix.length-1;
        while (cnvsRowsToDrawNdx > -1 && mtrxRowNdxForDrawing > -1){
            let mtrxRow = matrix[mtrxRowNdxForDrawing];
            mtrxRow.forEach((cellVal, cellNdx)=>{
                let elm = document.getElementById(`r${cnvsRowsToDrawNdx}c${cellNdx}`);
                let color =  (cellVal ? 'black' : '#d7d7fc');
                elm.style.backgroundColor = color;
            });
            cnvsRowsToDrawNdx--;
            mtrxRowNdxForDrawing--;
        }

    }

    this.spawnShape = function(){
        //draw initial shape on center
        //shape bottom left corner is current position of shape on screen
        //example: r0c2 means shape is just spawned 
        //draw only top bottom row
        let curPos = [0,2];
        
    }
    this.move = function(){
        //add param where
        //move shape left/right 
    }
    this.rotate = function(){
        //rotate clockwise  kbd up
    }
    this.throw = function(){
        //throw shape straight at bottom, kbd down
    }


}


function Tetris(rowNo, colNo){
    // let contours = ['L','T','Z'];
    let contours = ['L'];
    let curPos = [0,2];
    this.drawBoard = function(){
        let container = document.getElementById('tet-cont');
        let rows = new Array(rowNo).fill(1);
        let cols = new Array(colNo).fill(1);
        rows.forEach( (_, rowNdx)=>{
            const rowDiv = document.createElement('div');
            rowDiv.setAttribute('id', `r${rowNdx}`);
            rowDiv.setAttribute('class', 'row');
            container.appendChild(rowDiv);
            cols.forEach(( _ , colNdx) =>{
                const cellDiv = document.createElement('div');
                cellDiv.setAttribute('id', `r${rowNdx}c${colNdx}`);
                cellDiv.setAttribute('class', 'cell');
                rowDiv.appendChild(cellDiv);
            });
        });
    }
    this.getRandomShape = function(){
        const randomElement = contours[Math.floor(Math.random() * contours.length)];
        return new Shape(randomElement);
    }

    this.clearTrail = function(){
        //clean row abofe the matrix we are working on
        //that is where matrix "passed down" and made canvas dirty
        let rowNdxToClear = curPos[0]-4;
        if (rowNdxToClear > -1)
            for (let index = 0; index < colNo; index++) {
                const elm = document.getElementById(`r${rowNdxToClear}c${index}`)
                elm.style.backgroundColor = '#d7d7fc';
            }
    }

    this.tick = function(){
        let sh = this.getRandomShape();
        let ticker = 0;
        setInterval((x)=>{
            sh.draw(curPos);
            this.clearTrail();
            curPos[0]++;
            ticker++;
        }, 1100, curPos, ticker);

        // let tick = 0;
        // setInterval(
        //     function test(){
        //         let el = document.getElementById('r1c1');
        //         tick % 2 == 0 ? el.style.backgroundColor = 'red' : el.style.backgroundColor = 'green';
        //         tick++;
        //     },
        //     1000
        // );
    }

}

window.addEventListener('DOMContentLoaded', (event) => {
    let btnStart = document.getElementById('start');
    btnStart.onmouseup = () =>{
        const T = new Tetris(14,8);
        T.drawBoard();
        T.tick();
    }

});

