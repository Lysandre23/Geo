class Function {
    constructor(expr) {
        this.expr = expr;
        this.dead = false;
        this.active = false;
        this.children = new Array();
        this.id = generateId();
        this.color = generateColor();
        this.resol = 4;
    }

    draw() {
        if(!this.dead) {
            parser.evaluate('f(x) = ' + this.expr);
            stroke(this.color.r,this.color.g,this.color.b);
            strokeWeight((this.mouseOn() || this.active ? 4 : 2));
            noFill();
            let previousPoint;
            for(var i=0; i<width; i+=this.resol) {
                let x = convertPosAbsToRel(i,0).x;
                let y = parser.evaluate('f('+x+')');
                y = convertPosRelToAbs(0,y).y;
                if(i > 0) {
                    line(previousPoint.x,previousPoint.y,i-width/2,y);
                }
                previousPoint = {x:i-width/2,y:y};
            }
        }
    }

    mouseOn() {
        let xmouse = convertPosAbsToRel(mouseX,mouseY).x;
        let ymouse = convertPosRelToAbs(0,parser.evaluate('f('+xmouse+')')).y;
        return dist(mouseX-width/2,mouseY-height/2,mouseX-width/2,ymouse) < 6;
    }

    updateList() {
        $("#"+this.id).children('.colorContainer').children('.color').css("background-color","rgb(" + this.color.r + "," + this.color.g + "," + this.color.b);
        $("#"+this.id).children('.content').text("Function " + this.expr);
        $("#"+this.id).children('.content').css("background-color",(this.active || this.mouseOn() ? "rgb(230,230,230)" : "white"))
    }
}