import Commons from "./Commons.js";

export default class Cell {
    
    state = 0;
    color = null;
    row = null;
    col = null;

    constructor(state, color, row, col){
        this.state = state;
        this.color = color;
        this.row = row;
        this.col = col;
    }

    setColor(newColor){
        Commons.paintCellHtmlElement(this.row, this.col, this.state, newColor);
        this.color = newColor;
    }

    setState(newState){
        this.state = newState;
        return this;
    }
}

