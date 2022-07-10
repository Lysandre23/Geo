class Angle {
    constructor(p1,p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.id = generateId();
        this.color = generateColor();
        this.children = new Array();
        this.dead = false;
        this.active = false;
        this.value = 0;
    }

    draw() {
        if(!this.dead) {
            let inter = new Intersection(this.p1,this.p2);
            inter.draw();
            stroke(0);
            fill(0,0,0);
            let a1 = atan2(this.p1.p1.x-this.p1.p2.x,this.p1.p1.y-this.p1.p2.y)+HALF_PI;
            let a2 = atan2(this.p2.p1.x-this.p2.p2.x,this.p2.p1.y-this.p2.p2.y)+HALF_PI;
            //a1 = (a1 < HALF_PI ? a1 : 2*HALF_PI-a1);
            //a2 = (a2 < HALF_PI ? a2 : 2*HALF_PI-a2);
            let c = {
                x: convertPosRelToAbs(inter.x,0).x,
                y: convertPosRelToAbs(0,inter.y).y
            }
            if(degrees(a2-a1) > 0) {
                arc(c.x,c.y,50,50,a1,a2);
            }else{
                arc(c.x,c.y,50,50,2*Math.PI+a2,2*Math.PI+a1);
            }
        }
    }

    mouseOn() {
        return false;
    }

    updateList() {

    }
}