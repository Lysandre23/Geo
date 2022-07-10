class LongLine {
    constructor(p1,p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.active = false;
        this.dead = false;
        this.a = 0;
        this.b = 0;
        this.c = 0;
        this.color = generateColor();
        this.id = generateId();
        this.children = new Array();
    }

    draw() {
        if(!this.dead) {
            let mo = this.mouseOn();
            stroke(this.color.r,this.color.g,this.color.b);
            strokeWeight((mo || this.active ? 4 : 2));
            let vec = {
                x: this.p1.x-this.p2.x,
                y: -(this.p1.y-this.p2.y)
            }
            vec.x *= cam.w*cellSize;
            vec.y *= cam.w*cellSize;
            let coords = {
                x: convertPosRelToAbs(this.p1.x,this.p1.y).x,
                y: convertPosRelToAbs(this.p1.x,this.p1.y).y
            }
            line(coords.x-vec.x*1000,coords.y-vec.y*1000,coords.x+vec.x*1000,coords.y+vec.y*1000);
        }
    }

    mouseOn() {
        let m = {
            x: convertPosAbsToRel(mouseX,mouseY).x,
            y: convertPosAbsToRel(mouseX,mouseY).y
        };
        this.a = this.p2.y-this.p1.y;
        this.b = this.p1.x-this.p2.x;
        this.c = this.p1.y*(this.p2.x-this.p1.x)+this.p1.x*(this.p1.y-this.p2.y);
        let d = abs(this.a*m.x+this.b*m.y+this.c)/(Math.sqrt(this.a*this.a+this.b*this.b));
        return d<0.05;
    }

    updateList() {
        $("#"+this.id).children('.colorContainer').children('.color').css("background-color","rgb(" + this.color.r + "," + this.color.g + "," + this.color.b);
        $("#"+this.id).children('.content').text("Line " + approx(this.a) + "x" + sign(this.b) + Math.abs(approx(this.b)) + "y" + sign(this.c) + Math.abs(approx(this.c)) + " = 0");
        $("#"+this.id).children('.content').css("background-color",(this.active || this.mouseOn() ? "rgb(230,230,230)" : "white"))
    }
}