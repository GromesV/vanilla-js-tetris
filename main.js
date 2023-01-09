import Tetris from "./Tetris.js";

window.addEventListener('DOMContentLoaded', (event) => {
    let intervalId;
    let btnStart = document.getElementById('start');
    let btnStop = document.getElementById('stop');
    btnStart.onmouseup = () =>{
        const T = new Tetris(20,10);
        T.drawBoard();
        intervalId = T.tick();
        window._T = T;
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
    let T = window._T;
    switch (event.key) {
        case 'ArrowRight':
            if ((shape.y + shape.matrixWidth) == window._colNo)
                break;
            if (shape.canMoveRightLeft(table, 1)){
                shape.y++;
                shape.draw(table);
            }
            break;
        case 'ArrowLeft':
            if (shape.y === 0)
                break;
            if (shape.canMoveRightLeft(table, -1)){
                shape.y--;
                shape.draw(table);
            }
            break;
        case 'ArrowUp':
                if (shape.canRotate(table)){
                    shape.doRotate();
                    shape.draw(table);
                }
            break;
        case 'ArrowDown':
                if (!(T.bottomIsReached(shape.x) || T.shapeTouched(shape, table))){
                    shape.x++;
                    shape.draw(table);
                }
            break;
        default:
            break;
    }
    console.log('ada')
});

