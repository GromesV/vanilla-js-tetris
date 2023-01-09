let Commons = {
    TABLE_CANVAS_DEFAULT_COLOR : '#99B086',
    TABLE_CANVAS_DARKER_COLOR : '#839470',
    paintCellHtmlElement: function(rowNdx, colNdx, cellVal, color){
        let elm = document.getElementById(`r${rowNdx}c${colNdx}`);
        let elm1 = elm.children[0].children[0];
        let elm2 = elm.children[0].children[0].children[0]
        elm1.style.backgroundColor = (cellVal ?  '#222222' : this.TABLE_CANVAS_DARKER_COLOR);
        elm2.style.backgroundColor = (cellVal ?  '#222222' : this.TABLE_CANVAS_DARKER_COLOR);
    },
    contours : {
        'L' : {
            'matrix' : [
                [1,0],
                [1,0],
                [1,1],
            ],
            'color' : "#9b5fe0",
            'rotations' : [
                {
                    'matrix' :[[1,1,1],
                               [1,0,0]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [1,1],
                        [0,1],
                        [0,1],
                    ],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[[0,0,1],
                               [1,1,1]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [1,0],
                        [1,0],
                        [1,1],
                    ],
                    'delta_position' : [0,0],
                },
            ]
        },
        'J' : {
            'matrix' : [
                [0,1],
                [0,1],
                [1,1],
            ],
            'color': "#16a4d8",
            'rotations' : [
                {
                    'matrix' :[[1,0,0],
                               [1,1,1]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [1,1],
                        [1,0],
                        [1,0],
                    ],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[[1,1,1],
                               [0,0,1]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [0,1],
                        [0,1],
                        [1,1],
                    ],
                    'delta_position' : [0,0],
                },
            ]
        },
        'T' : {
            'matrix' : [
                [0,1,0],
                [1,1,1],
            ],
            'color':"#60dbe8",
            'rotations' : [
                {
                    'matrix' :[[1,0],
                               [1,1],
                               [1,0]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [1,1,1],
                        [0,1,0],
                    ],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[[0,1],
                               [1,1],
                               [0,1]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [0,1,0],
                        [1,1,1],
                    ],
                    'delta_position' : [0,0],
                },
            ]
        },
        'S' : {
            'matrix' : [
                [0,1,1],
                [1,1,0],
            ],
            'color' : "#8bd346",
            'rotations' : [
                {
                    'matrix' :[[1,0],
                               [1,1],
                               [0,1]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [0,1,1],
                        [1,1,0],
                    ],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[[1,0],
                               [1,1],
                               [0,1]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [0,1,1],
                        [1,1,0],
                    ],
                    'delta_position' : [0,0],
                },
            ]
        },
        'Z' : {
            'matrix' : [
                [1,1,0],
                [0,1,1],
            ],
            'color' : "#efdf48",
            'rotations' : [
                {
                    'matrix' :[[0,1],
                               [1,1],
                               [1,0]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [1,1,0],
                        [0,1,1],
                    ],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[[0,1],
                               [1,1],
                               [1,0]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [1,1,0],
                        [0,1,1],
                    ],
                    'delta_position' : [0,0],
                },
            ]
        },
        'O' : {
            'matrix' : [
                [1,1],
                [1,1],
            ],
            'color' : "#f9a52c",
            'rotations' : [
                {
                    'matrix' :[[1,1],
                               [1,1]],
                    'delta_position' : [0,0],
                },
            ]
        },
        'I' : {
            'matrix' : [
                [1],
                [1],
                [1],
                [1],
            ],
            'color' : "#d64e12",
            'rotations' : [
                {
                    'matrix' :[[1,1,1,1]],
                    'delta_position' : [0,0],
                },
                {
                    'matrix' :[
                        [1],
                        [1],
                        [1],
                        [1],
                    ],
                    'delta_position' : [0,0],
                },
            ]
        },
        
    },

}

export default  Commons;