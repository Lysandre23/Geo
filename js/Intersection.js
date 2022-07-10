class Intersection {
    constructor(p1,p2) {
        this.p1 = p2;
        this.p2 = p1;
        this.type;
        this.id = generateId();
        this.children = new Array();
        if(p1 instanceof LongLine && p2 instanceof LongLine) {
            this.type = "line-line";
        }
        this.dead = false;
        this.color = generateColor();
        this.size = 10;
        this.active = false;
        this.x = 0;
        this.y = 0;
    }

    draw() {
        if(!this.dead) {
            strokeWeight(((this.mouseOn() || this.active) ? 4 : 2));
            stroke(this.color.r,this.color.g,this.color.b);
            switch(this.type) {
                case "line-line":
                    let coords = {
                        x: (this.p1.b*this.p2.c-this.p2.b*this.p1.c)/(this.p1.a*this.p2.b-this.p2.a*this.p1.b),
                        y: (this.p1.c*this.p2.a-this.p1.a*this.p2.c)/(this.p1.a*this.p2.b-this.p2.a*this.p1.b)
                    }
                    this.x = coords.x;
                    this.y = coords.y;
                    coords = {
                        x: convertPosRelToAbs(coords.x,coords.y).x,
                        y: convertPosRelToAbs(coords.x,coords.y).y
                    }

                    noFill();
                    line(coords.x+cos(Math.PI/4)*this.size,coords.y+sin(Math.PI/4)*this.size,coords.x-cos(Math.PI/4)*this.size,coords.y-sin(Math.PI/4)*this.size);
                    line(coords.x+cos(Math.PI/4)*this.size,coords.y-sin(Math.PI/4)*this.size,coords.x-cos(Math.PI/4)*this.size,coords.y+sin(Math.PI/4)*this.size);
                    
                    break;
            }
        }
    }

    mouseOn() {
        return false;
    }

    updateList() {
        $("#"+this.id).children('.colorContainer').children('.color').css("background-color","rgb(" + this.color.r + "," + this.color.g + "," + this.color.b);
        $("#"+this.id).children('.content').css("background-color",(this.active || this.mouseOn() ? "rgb(230,230,230)" : "white"))
        $("#"+this.id).children('.content').text("Intersection (" + approx(this.x) + ";" + approx(this.y) + ")");
    }
}