class Circle {
    constructor(p1,r) {
        this.p1 = p1;
        this.d = 2*r;
        this.dead = false;
        this.active = false;
        this.id = generateId();
        this.children = new Array();
        this.color = generateColor();
    }

    draw() {
        if(!this.dead) {
            let mo = this.mouseOn();
            noStroke();
            let pos = {
                x: convertPosRelToAbs(this.p1.x, this.p1.y).x,
                y: convertPosRelToAbs(this.p1.x, this.p1.y).y
            }
            let m = {
                x: convertPosAbsToRel(mouseX,mouseY).x,
                y: convertPosAbsToRel(mouseX,mouseY).y
            };
            let newR = dist(m.x,m.y,this.p1.x,this.p1.y);
            fill(this.color.r,this.color.g,this.color.b);
            if(this.active && mouseIn()) {
                this.d = 2*newR;
                text("r="+Math.round(this.d/2*100)/100,pos.x+15,pos.y+15);
            }else if(mo){
                text("r="+Math.round(this.d/2*100)/100,pos.x+15,pos.y+15);
            }
            //text("r="+this.d/2,pos.x+15,pos.y+15);
            noFill();
            stroke(this.color.r,this.color.g,this.color.b);
            strokeWeight((mo || this.active ? 4 : 2));
            circle(pos.x,pos.y,this.d*cellSize);
        }
    }

    mouseOn() {
        let m = {
            x: convertPosAbsToRel(mouseX,mouseY).x,
            y: convertPosAbsToRel(mouseX,mouseY).y
        };
        return (dist(m.x,m.y,this.p1.x,this.p1.y) > this.d/2-0.05 && dist(m.x,m.y,this.p1.x,this.p1.y) < this.d/2+0.05);
    }

    updateList() {
        $("#"+this.id).children('.colorContainer').children('.color').css("background-color","rgb(" + this.color.r + "," + this.color.g + "," + this.color.b);
        $("#"+this.id).children('.content').css("background-color",(this.active || this.mouseOn() ? "rgb(230,230,230)" : "white"))
        $("#"+this.id).children('.content').text("Circle (" + approx(this.p1.x) + ";" + approx(this.p1.y) + ") r=" + approx(0.5*this.d));
    }
}