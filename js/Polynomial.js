class Polynomial {
    constructor(method,param1) {
        this.dead = false;
        this.active = false;
        this.resol = 1;
        this.id = generateId();
        this.children = new Array();
        this.color = generateColor();
        this.coeff = new Array();
        /* -------------------- */
        this.method = method;
        this.param1 = param1;
    }

    draw() {
        if(!this.dead) {
            stroke(this.color.r,this.color.g,this.color.b);
            strokeWeight((this.mouseOn() || this.active ? 4 : 2));
            switch(this.method) {
                case "points":
                    // param1 -> array of points
                    this.coeff = Lagrange(this.param1);
                    break;
                case "coeff":
                    this.coeff = this.param1;
                    break;
                case "derivate":
                    let c1 = new Array(this.param1.coeff.length-1);
                    for(var i=0; i<c1.length; i++) {
                        c1[i] = (i+1)*this.param1.coeff[i+1];
                    }
                    this.coeff = c1;
                    break;
                case "integrale":
                    let c2 = new Array(this.param1.coeff.length+1);
                    c2[0] = 0;
                    for(var i=0; i<this.param1.coeff.length; i++) {
                        c2[i+1] = (this.param1.coeff[i]/(i+1));
                    }
                    this.coeff = c2;
                    break;
            }
            let previousPoint;
            for(var i=0; i<width; i+=this.resol) {
                let x = convertPosAbsToRel(i,0).x;
                let y = this.valueAt(x);
                if(i > 0) {
                    line(previousPoint.x,previousPoint.y,i-width/2,y);
                }
                previousPoint = {x:i-width/2,y:y};
            }
        } 
    }

    die() {
        if(this.children != []) {
            for(var i=0; i<this.children.length; i++) {
                this.children[i].die();
            }
        }
        this.dead = true;
        $("#"+this.id).remove();
    }

    mouseOn() {
        let xmouse = convertPosAbsToRel(mouseX,mouseY).x;
        let ymouse = this.valueAt(xmouse);
        return dist(mouseX-width/2,mouseY-height/2,mouseX-width/2,ymouse) < 6;
    }

    valueAt(x) {
        let value = 0;
        for(var k=0; k<this.coeff.length; k++) {
            value += Math.pow(x,k)*this.coeff[k];
        }
        let y = convertPosRelToAbs(1,value).y;
        return y;
    }

    updateList() {
        $("#"+this.id).children('.colorContainer').children('.color').css("background-color","rgb(" + this.color.r + "," + this.color.g + "," + this.color.b);
        let s = "y=";
        for(var i=0; i<this.coeff.length; i++) {
            if(this.coeff[i] != 0) {
                if(i == 0) {
                    s += (this.coeff[i] != 0 ? ((abs(this.coeff[i]) > 0.0001 ? Math.abs(approx(this.coeff[i])) : "Ɛ")) : "");
                }else{
                    s += sign(this.coeff[i])+ (this.coeff[i] != 0 ? ((abs(this.coeff[i]) > 0.0001 ? Math.abs(approx(this.coeff[i])) : "Ɛ")) : "")+(this.coeff[i] != 0 ? "x" : "") + power[i];
                }
            }
        }
        $("#"+this.id).children('.content').text("Polynomial " + s);
        $("#"+this.id).children('.content').css("background-color",(this.active || this.mouseOn() ? "rgb(230,230,230)" : "white"))
    }
}