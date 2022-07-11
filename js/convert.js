function convertPosRelToAbs(a,b) {
    return {
        x: (a-cam.x)*cellSize,
        y: -(b-cam.y)*cellSize
    }
}

function convertPosAbsToRel(a,b) {
    return {
        x: -(-cam.x-(a-width/2)/cellSize),
        y: (cam.y-(b-height/2)/cellSize)
    }
}

function mousePosInRel() {
    let m = {
        x: convertPosAbsToRel(mouseX,mouseY).x,
        y: convertPosAbsToRel(mouseX,mouseY).y
    }
    return m;
}

function roundPosition() {
    for(var i=0; i<p.length; i++) {
        if(p[i].active) {
            p[i].x = Math.round(p[i].x);
            p[i].y = Math.round(p[i].y);
            p[i].active = false;
        }
    }
}