class Integral {
    constructor(p1) {
        this.p1 = p1;
        this.active = false;
        this.dead = false;
        this.resol = this.p1.resol;
    }

    draw() {
        let coeff = new Array(this.p1.coeff.length+1);
        coeff[0] = 0;
        for(var i=0; i<this.p1.coeff.length; i++) {
            coeff[i+1] = (this.p1.coeff[i]/(i+1));
        }
        stroke(((this.mouseOn() || this.active) ? UIcolor : 0));
        strokeWeight(2);
        noFill();
        let previousPoint;
        for(var i=0; i<width; i+=this.resol) {
            let x = convertPosAbsToRel(i,5).x;
            let y = this.valueAt(x,coeff);
            if(i > 0) {
                line(previousPoint.x,previousPoint.y,i-width/2,y);
            }
            previousPoint = {x:i-width/2,y:y};
        }
        
    }

    valueAt(x,c) {
        let value = 0;
        for(var k=0; k<c.length; k++) {
            value += Math.pow(x,k)*c[k];
        }
        let y = convertPosRelToAbs(1,value).y;
        return y;
    }

    mouseOn() {
        return false;
    }
}