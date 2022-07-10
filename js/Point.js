class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.d = 13;
        this.id = generateId();
        this.active = false;
        this.children = new Array();
        this.color = generateColor();
    }

    draw() {
        noStroke();
        fill(this.color.r,this.color.g,this.color.b)
        strokeWeight(2);
        if(this.active) {
            //text("(" + Math.round(this.x*100)/100 + " ; " + Math.round(this.y*100)/100 + ")",mouseX-width/2+this.d/1.8,mouseY-height/2-this.d/1.8);
            /*
            if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
                this.x = Math.round(convertPosAbsToRel(mouseX,mouseY).x*100)/100;
                this.y = Math.round(convertPosAbsToRel(mouseX,mouseY).y*100)/100;
            }
            */
            //stroke(0);
        }else if(this.mouseOn()){
            text("(" + Math.round(this.x*100)/100 + " ; " + Math.round(this.y*100)/100 + ")",mouseX-width/2+this.d/1.8,mouseY-height/2-this.d/1.8);
            //stroke(this.color.r,this.color.g,this.color.b);
        }
        circle((this.x-cam.x)*cellSize,-(this.y-cam.y)*cellSize,(this.active ? this.d*1.2 : this.d));
    }

    mouseOn() {
        return dist(cellSize*(this.x-cam.x)+width/2,cellSize*(-this.y+cam.y)+height/2,mouseX,mouseY) < this.d/2;
    }

    updateList() {
        $("#"+this.id).children('.colorContainer').children('.color').css("background-color","rgb(" + this.color.r + "," + this.color.g + "," + this.color.b);
        $("#"+this.id).children('.content').css("background-color",(this.active || this.mouseOn() ? "rgb(230,230,230)" : "white"))
        $("#"+this.id).children('.content').text("Point (" + Math.round(this.x*100)/100 + ";" + Math.round(this.y*100)/100 + ")");
    }
}