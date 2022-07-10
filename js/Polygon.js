class Polygon {
    constructor(pointList) {
        this.pointList = pointList;
        this.dead = false;
        this.active = false;
        this.id = generateId();
        this.children = new Array();
        this.color = generateColor();
    }

    draw() {
        if(!this.dead) {
            stroke(this.color.r,this.color.g,this.color.b);
            strokeWeight((this.mouseOn() || this.active ? 2 : 0));
            fill(this.color.r,this.color.g,this.color.b,50);
            beginShape();
            for(var i=0; i<this.pointList.length; i++) {
                let coords = {
                    x: convertPosRelToAbs(this.pointList[i].x,this.pointList[i].y).x,
                    y: convertPosRelToAbs(this.pointList[i].x,this.pointList[i].y).y
                }
                vertex(coords.x,coords.y);
            }
            endShape(CLOSE);
        }
        
    }

    mouseOn() {
        return false;
    }

    updateList() {
        let peri = 0;
        let l = this.pointList.length;
        for(var i=0; i<l; i++) {
            peri += dist(this.pointList[i].x,this.pointList[i].y,this.pointList[(i+1)%l].x,this.pointList[(i+1)%l].y);
        }
        $("#"+this.id).children('.colorContainer').children('.color').css("background-color","rgb(" + this.color.r + "," + this.color.g + "," + this.color.b);
        $("#"+this.id).children('.content').css("background-color",(this.active || this.mouseOn() ? "rgb(230,230,230)" : "white"))
        $("#"+this.id).children('.content').text("Polygon perimeter=" + approx(peri));
    }
}