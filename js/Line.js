class Line {
    constructor(p1,p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.active = false;
        this.dead = false;
        this.a = 0;
        this.b = 0;
        this.c = 0;
        this.id = generateId();
        this.color = generateColor();
        this.children = new Array();
    }

    draw() {
        if(!this.dead) {
            let mo = this.mouseOn();
            stroke(this.color.r,this.color.g,this.color.b);
            strokeWeight((mo || this.active ? 4 : 2));
            let coords = [
                convertPosRelToAbs(this.p1.x,this.p1.y),
                convertPosRelToAbs(this.p2.x,this.p2.y)
            ]
            line(coords[0].x,coords[0].y,coords[1].x,coords[1].y);
            
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
        let t = true;
        if(this.p1.x > this.p2.x) {
            if(m.x > this.p2.x && m.x < this.p1.x) {
                t = true;
            }else{
                t = false;
            }
        }else{
            if(m.x > this.p1.x && m.x < this.p2.x) {
                t = true;
            }else{
                t = false;
            }
        }
        if(this.p1.x == this.p2.x) {
            if(this.p1.y > this.p2.y) {
                if(m.y < this.p1.y && m.y > this.p2.y) {
                    t = true;
                }else{
                    t = false;
                }
            }else{
                if(m.y > this.p1.y && m.y < this.p2.y) {
                    t = true;
                }else{
                    t = false;
                }
            }
        }
        return d < 0.08 && t;
    }

    updateList() {
        $("#"+this.id).children('.colorContainer').children('.color').css("background-color","rgb(" + this.color.r + "," + this.color.g + "," + this.color.b);
        $("#"+this.id).children('.content').text("Segment (" + approx(this.p1.x) + ";" + Math.round(this.p1.y*100)/100 + ") -> (" + Math.round(this.p2.x*100)/100 + ";" + Math.round(this.p2.y*100)/100 + ")");
        $("#"+this.id).children('.content').css("background-color",(this.active || this.mouseOn() ? "rgb(230,230,230)" : "white"))
    }
}