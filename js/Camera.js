const UIcolor = "#eb2f06";
const power = ["","","²","³","⁴","⁵","⁶","⁷","⁸","⁹"];
const colorButtonActive = "rgb(230,230,230)"
const parser = math.parser();

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 15;
        this.h = this.w*window.innerHeight/window.innerWidth;
    }

    move(depx,depy) {
        this.x += depx;
        this.y += depy;
    }
}

function generateColor() {
    return {r: Math.random()*205+50,g: Math.random()*205+50, b: Math.random()*205+50};
}

function generateId() {
    return Math.round(Math.random()*200000);
}

function sign(n) {
    return (n > 0 ? "+" : "-");
}

function approx(n) {
    if(Math.abs(n) > 0.01) {
        return Math.round(100*n)/100;
    }else if(Math.abs(n) > 0.001) {
        return Math.round(1000*n)/1000;
    }else {
        return Math.round(10000*n)/10000;
    }
}

function mouseIn() {
    return (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height);
}