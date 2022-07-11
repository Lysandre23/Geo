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
        this.perpendicularOf = false;
        if(this.p1 instanceof LongLine) {
            this.perpendicularOf = true;
        }
    }

    draw() {
        if(!this.dead) {
            if(!this.perpendicularOf) {
                this.a = this.p2.y-this.p1.y;
                this.b = this.p1.x-this.p2.x;
                this.c = this.p1.y*(this.p2.x-this.p1.x)+this.p1.x*(this.p1.y-this.p2.y);
            }else if(this.perpendicularOf) {
                this.a = this.p1.b;
                this.b = -this.p1.a;
                this.c = this.p1.a*this.p2.y-this.p1.b*this.p2.x;
            }
            let xLeftCorner = cam.x-cam.w/2;
            let xRightCorner = cam.x+cam.w/2;
            let yLeftCorner = -(this.a*xLeftCorner+this.c)/this.b;
            let yRightCorner = -(this.a*xRightCorner+this.c)/this.b;
            let c1 = convertPosRelToAbs(xLeftCorner,yLeftCorner);
            let c2 = convertPosRelToAbs(xRightCorner,yRightCorner);
            let mo = this.mouseOn();
            stroke(this.color.r,this.color.g,this.color.b);
            strokeWeight((mo || this.active ? 4 : 2));
            if(this.b != 0) {
                line(c1.x,c1.y,c2.x,c2.y);
            }else{
                line(this.p2.x*cellSize,-height/2,this.p2.x*cellSize,height/2);
            }
        }
    }

    mouseOn() {
        let m = {
            x: convertPosAbsToRel(mouseX,mouseY).x,
            y: convertPosAbsToRel(mouseX,mouseY).y
        };
        let d = abs(this.a*m.x+this.b*m.y+this.c)/(Math.sqrt(this.a*this.a+this.b*this.b));
        return d<0.05;
    }

    updateList() {
        $("#"+this.id).children('.colorContainer').children('.color').css("background-color","rgb(" + this.color.r + "," + this.color.g + "," + this.color.b);
        $("#"+this.id).children('.content').text("Line " + approx(this.a) + "x" + sign(this.b) + Math.abs(approx(this.b)) + "y" + sign(this.c) + Math.abs(approx(this.c)) + " = 0");
        $("#"+this.id).children('.content').css("background-color",(this.active || this.mouseOn() ? "rgb(230,230,230)" : "white"))
    }
}